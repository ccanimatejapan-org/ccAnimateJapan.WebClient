import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeHtml, stripHtml } from './html.js';

const ALLOWED_TAG = /<\/?(?:p|br|strong|b|em|i|u|ul|ol|li|div)>/g;

// 清洗結果只能剩「無屬性的白名單標籤」；拿掉這些標籤後不得再有任何 `<`。
function assertSafeMarkup(output) {
  assert.equal(output.replace(ALLOWED_TAG, '').includes('<'), false, output);
}

describe('sanitizeHtml', () => {
  it('returns empty string for null, undefined and empty input', () => {
    assert.equal(sanitizeHtml(null), '');
    assert.equal(sanitizeHtml(undefined), '');
    assert.equal(sanitizeHtml(''), '');
  });

  it('keeps plain text, CJK text and entities untouched', () => {
    assert.equal(sanitizeHtml('限量公仔 30cm'), '限量公仔 30cm');
    assert.equal(sanitizeHtml('Tom &amp; Jerry &lt;3'), 'Tom &amp; Jerry &lt;3');
    assert.equal(sanitizeHtml('&lt;script&gt;alert(1)&lt;/script&gt;'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('keeps every whitelisted tag', () => {
    const html = '<div><p>a<br>b</p><strong>s</strong><b>b</b><em>e</em><i>i</i><u>u</u>'
      + '<ul><li>1</li></ul><ol><li>2</li></ol></div>';
    assert.equal(sanitizeHtml(html), html);
  });

  it('keeps the shape the admin rich text editor produces', () => {
    const html = '<div>第一行<br>第二行</div><div><strong>加粗</strong></div>';
    assert.equal(sanitizeHtml(html), html);
  });

  it('normalizes tag case and self-closing br', () => {
    assert.equal(sanitizeHtml('<STRONG>a</STRONG><BR/>b<br />c'), '<strong>a</strong><br>b<br>c');
  });

  it('removes every attribute from allowed tags', () => {
    assert.equal(
      sanitizeHtml('<p class="x" style="color:red" onclick="alert(1)" data-a=b>hi</p>'),
      '<p>hi</p>'
    );
    assert.equal(sanitizeHtml('<div onmouseover=alert(1)>hi</div>'), '<div>hi</div>');
    assert.equal(sanitizeHtml('<li\nonclick\n=\n"alert(1)">x</li>'), '<li>x</li>');
  });

  it('does not end a tag at a ">" inside a quoted attribute value', () => {
    assert.equal(sanitizeHtml('<p title=">" onclick="alert(1)">x</p>'), '<p>x</p>');
    assert.equal(sanitizeHtml("<p title='>' onclick='alert(1)'>x</p>"), '<p>x</p>');
    assert.equal(sanitizeHtml('<p title = ">" onclick=alert(1)>x</p>'), '<p>x</p>');
  });

  describe('XSS payloads', () => {
    // [說明, 輸入, 預期輸出]；輸出若殘留 alert(1) 字樣，都只是無害的純文字。
    const cases = [
      ['script tag', '<script>alert(1)</script>', ''],
      ['script tag with attributes', '<script src="https://evil.example/x.js"></script>', ''],
      ['mixed case script', '<ScRiPt>alert(1)</sCrIpT>', ''],
      ['script with whitespace', '<script\n\t >alert(1)</script\n >', ''],
      ['script with slash after name', '<script/x>alert(1)</script/x>', ''],
      ['img onerror', '<img src=x onerror=alert(1)>', ''],
      ['img onerror quoted', '<img src="x" onerror="alert(document.cookie)">', ''],
      ['img without spaces', '<img/src=x/onerror=alert(1)>', ''],
      ['img with newlines', '<img\nsrc=x\nonerror=alert(1)>', ''],
      ['anchor javascript href', '<a href=javascript:alert(1)>click</a>', 'click'],
      ['anchor quoted javascript href', '<a href="javascript:alert(1)">click</a>', 'click'],
      ['anchor obfuscated javascript href', '<a href="jav&#x09;ascript:alert(1)">click</a>', 'click'],
      ['anchor uppercase javascript href', '<A HREF="JaVaScRiPt:alert(1)">click</A>', 'click'],
      ['svg onload', '<svg onload=alert(1)>', ''],
      ['svg with script', '<svg><script>alert(1)</script></svg>', ''],
      ['svg with animate', '<svg><animate onbegin=alert(1) attributeName=x dur=1s>', ''],
      ['math', '<math><mtext><script>alert(1)</script></mtext></math>', ''],
      ['iframe srcdoc', '<iframe srcdoc="<script>alert(1)</script>"></iframe>', ''],
      ['iframe javascript src', '<iframe src="javascript:alert(1)"></iframe>', ''],
      ['object and embed', '<object data="javascript:alert(1)"></object><embed src="javascript:alert(1)">', ''],
      ['form and input', '<form action="javascript:alert(1)"><input autofocus onfocus=alert(1)></form>', ''],
      ['body onload', '<body onload=alert(1)>', ''],
      ['meta refresh', '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">', ''],
      ['link and base', '<link rel=stylesheet href=//evil.example/x.css><base href="//evil.example/">', ''],
      ['style tag', '<style>*{background:url(javascript:alert(1))}</style>', ''],
      ['nested script split', '<scr<script>ipt>alert(1)</scr</script>ipt>', 'ipt>alert(1)ipt>'],
      ['nul in tag name', '<scr\u0000ipt>alert(1)</scr\u0000ipt>', ''],
      ['html comment hiding script', '<!--<script>alert(1)</script>-->', ''],
      ['conditional comment', '<!--[if gte IE 4]><script>alert(1)</script><![endif]-->', ''],
      ['cdata', '<![CDATA[<script>alert(1)</script>]]>', 'alert(1)]]>'],
      ['xml processing instruction', '<?xml version="1.0"?><script>alert(1)</script>', ''],
      [
        'mutation xss',
        '<math><mtext><table><mglyph><style><!--</style><img title="--&gt;&lt;/mglyph&gt;&lt;img&Tab;src=1&Tab;onerror=alert(1)&gt;">',
        ''
      ],
      ['unclosed img', '<img src=x onerror=alert(1)', ''],
      ['unclosed script', '<script>alert(1)', ''],
      ['unclosed attribute quote', '<a href="javascript:alert(1)>click', ''],
      ['double angle bracket', '<<script>alert(1)</script>', '&lt;'],
      ['angle bracket then space', '< script>alert(1)</script>', '&lt; script>alert(1)'],
      ['closing tag with attributes', '</p onclick=alert(1)>', ''],
      ['bogus closing tag', '</ img src=x onerror=alert(1)>', '']
    ];

    for (const [name, input, expected] of cases) {
      it(`neutralizes ${name}`, () => {
        const output = sanitizeHtml(input);
        assertSafeMarkup(output);
        assert.equal(output, expected);
      });
    }

    it('removes script and style content together with the tags', () => {
      assert.equal(sanitizeHtml('a<script>alert(1)</script>b'), 'ab');
      assert.equal(sanitizeHtml('a<style>p{color:red}</style>b'), 'ab');
      assert.equal(sanitizeHtml('<p>a</p><SCRIPT SRC=//evil.example/x.js></SCRIPT><p>b</p>'), '<p>a</p><p>b</p>');
    });

    it('only closes script at its own end tag', () => {
      assert.equal(sanitizeHtml('<script>alert(1)</style><b>x</b>'), '');
      assert.equal(sanitizeHtml('<style>a</script><b>x</b></style>y'), 'y');
    });

    it('unwraps non-whitelisted tags but keeps their text', () => {
      assert.equal(sanitizeHtml('<a href="https://example.com">連結</a>'), '連結');
      assert.equal(sanitizeHtml('<span style="color:red">紅</span><h1>標題</h1>'), '紅標題');
      assert.equal(sanitizeHtml('<img src=x onerror=alert(1)>保留文字'), '保留文字');
    });

    it('drops the rest of the input after an unterminated tag or comment', () => {
      assert.equal(sanitizeHtml('hi<img src=x onerror=alert(1)'), 'hi');
      assert.equal(sanitizeHtml('hi<script>alert(1)'), 'hi');
      assert.equal(sanitizeHtml('hi<a href="x>click'), 'hi');
      assert.equal(sanitizeHtml('hi<!-- never closed'), 'hi');
    });

    it('drops comments, doctype and processing instructions', () => {
      assert.equal(sanitizeHtml('a<!-- c -->b'), 'ab');
      assert.equal(sanitizeHtml('<!DOCTYPE html>a'), 'a');
      assert.equal(sanitizeHtml('<?xml version="1.0"?>a'), 'a');
    });

    it('escapes a stray "<" that does not start a tag', () => {
      assert.equal(sanitizeHtml('1 < 2'), '1 &lt; 2');
      assert.equal(sanitizeHtml('a<3'), 'a&lt;3');
      assert.equal(sanitizeHtml('<<b>x</b>'), '&lt;<b>x</b>');
      assert.equal(sanitizeHtml('end <'), 'end &lt;');
    });
  });

  describe('well-formed output', () => {
    it('closes unclosed allowed tags', () => {
      assert.equal(sanitizeHtml('<p>hi'), '<p>hi</p>');
      assert.equal(sanitizeHtml('<b><i>x'), '<b><i>x</i></b>');
      assert.equal(sanitizeHtml('<ul><li>a<li>b'), '<ul><li>a<li>b</li></li></ul>');
    });

    it('drops stray closing tags and closing br', () => {
      assert.equal(sanitizeHtml('x</p></div>'), 'x');
      assert.equal(sanitizeHtml('a</br>b'), 'ab');
    });

    it('repairs misnested tags', () => {
      assert.equal(sanitizeHtml('<b><i>x</b>y</i>'), '<b><i>x</i></b>y');
    });

    it('is idempotent', () => {
      const inputs = [
        '<div>第一行<br>第二行</div>',
        '<p>hi',
        '<b><i>x</b>y</i>',
        '<img src=x onerror=alert(1)>a<script>alert(1)</script>b',
        '1 < 2 &amp; 3 > 2',
        '<<b>x</b>',
        '<!-- c --><p onclick=x>y</p>'
      ];
      for (const input of inputs) {
        const once = sanitizeHtml(input);
        assert.equal(sanitizeHtml(once), once, input);
      }
    });
  });

  it('coerces non-string input to a string', () => {
    assert.equal(sanitizeHtml(123), '123');
  });

  it('stays linear on pathological input', () => {
    const inputs = [
      '<'.repeat(200000),
      '<a '.repeat(100000),
      '<a b="'.repeat(50000),
      '<!--'.repeat(100000),
      '<b>'.repeat(50000) + '</i>'.repeat(50000),
      '<script>'.repeat(50000)
    ];
    const startedAt = Date.now();
    for (const input of inputs) {
      assertSafeMarkup(sanitizeHtml(input));
    }
    assert.ok(Date.now() - startedAt < 3000);
  });
});

describe('stripHtml', () => {
  it('returns empty string for null, undefined and empty input', () => {
    assert.equal(stripHtml(null), '');
    assert.equal(stripHtml(undefined), '');
    assert.equal(stripHtml(''), '');
  });

  it('returns plain text unchanged apart from whitespace normalization', () => {
    assert.equal(stripHtml('限量公仔 30cm'), '限量公仔 30cm');
    assert.equal(stripHtml('  a \t b \n c  '), 'a b c');
  });

  it('turns br and block boundaries into line breaks', () => {
    assert.equal(stripHtml('<div>第一行<br>第二行</div>'), '第一行\n第二行');
    assert.equal(stripHtml('<p>a</p><p>b</p>'), 'a\nb');
    assert.equal(stripHtml('<div>a</div><div>b</div>'), 'a\nb');
    assert.equal(stripHtml('<ul><li>x</li><li>y</li></ul>'), 'x\ny');
    assert.equal(stripHtml('a<br><br><br>b'), 'a\nb');
  });

  it('does not add breaks around inline tags', () => {
    assert.equal(stripHtml('a<strong>b</strong>c<em>d</em>'), 'abcd');
  });

  it('decodes the supported entities exactly once', () => {
    assert.equal(
      stripHtml('Tom &amp; Jerry &lt;3 &gt; &quot;x&quot; &#39;y&#39; a&nbsp;b'),
      'Tom & Jerry <3 > "x" \'y\' a b'
    );
    assert.equal(stripHtml('&amp;lt;b&amp;gt;'), '&lt;b&gt;');
    assert.equal(stripHtml('&amp;amp;'), '&amp;');
  });

  it('keeps entity-encoded markup as literal text instead of treating it as a tag', () => {
    assert.equal(stripHtml('&lt;b&gt;x&lt;/b&gt;'), '<b>x</b>');
  });

  it('removes script and style together with their content', () => {
    assert.equal(stripHtml('a<script>alert(1)</script>b'), 'ab');
    assert.equal(stripHtml('a<style>p{color:red}</style>b'), 'ab');
  });

  it('removes non-whitelisted tags and their attributes but keeps the text', () => {
    assert.equal(stripHtml('<img src=x onerror=alert(1)>hello'), 'hello');
    assert.equal(stripHtml('<a href=javascript:alert(1)>link</a>'), 'link');
    assert.equal(stripHtml('<svg onload=alert(1)>text'), 'text');
    assert.equal(stripHtml('<p onclick="alert(1)">x</p>'), 'x');
  });

  it('drops comments and unterminated tags', () => {
    assert.equal(stripHtml('a<!-- <b>c</b> -->b'), 'ab');
    assert.equal(stripHtml('hi <img src=x onerror=alert(1)'), 'hi');
  });

  it('keeps a stray "<" as plain text', () => {
    assert.equal(stripHtml('1 < 2'), '1 < 2');
  });

  it('returns empty string when nothing visible is left', () => {
    assert.equal(stripHtml('<div><br></div>'), '');
    assert.equal(stripHtml('<p>&nbsp;</p>'), '');
    assert.equal(stripHtml('<ul><li></li></ul>'), '');
    assert.equal(stripHtml('<script>alert(1)</script>'), '');
    assert.equal(stripHtml('   '), '');
  });

  it('coerces non-string input to a string', () => {
    assert.equal(stripHtml(123), '123');
  });
});
