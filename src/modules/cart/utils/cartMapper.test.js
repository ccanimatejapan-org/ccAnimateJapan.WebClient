import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mapCartGroups, mapServerCart, mapServerCartItem } from './cartMapper.js';

describe('mapServerCartItem', () => {
  it('normalizes a server item payload', () => {
    const item = mapServerCartItem({
      id: '10',
      activityId: '7',
      activityName: 'B',
      productId: '4',
      productName: 'P',
      imageUrl: '/img/01',
      price: '120',
      quantity: '3',
      note: '  hello world  ',
      activityIsPreOrder: true,
      officialShippingStartTime: '2026-08-01',
      officialShippingEndTime: '2026-08-10'
    });

    assert.deepEqual(item, {
      id: '10',
      activityId: 7,
      activityName: 'B',
      productId: 4,
      productName: 'P',
      imageUrl: '/img/01',
      price: 120,
      quantity: 3,
      note: 'hello world',
      info: 'hello world',
      activityIsPreOrder: true,
      officialShippingStartTime: '2026-08-01',
      officialShippingEndTime: '2026-08-10'
    });
  });

  it('falls back to info if note is missing', () => {
    const item = mapServerCartItem({
      activityId: 1,
      productId: 2,
      info: '  note from info  '
    });

    assert.equal(item?.note, 'note from info');
    assert.equal(item?.info, 'note from info');
  });

  it('enforces quantity minimum 1 and number coercion', () => {
    assert.equal(mapServerCartItem({ activityId: 1, productId: 2, quantity: 0, price: '12.5' }).quantity, 1);
    assert.equal(mapServerCartItem({ activityId: 1, productId: 2, quantity: -3 }).quantity, 1);
    assert.equal(mapServerCartItem({ activityId: 1, productId: 2, quantity: 'abc' }).quantity, 1);
  });

  it('drops items missing valid ids', () => {
    assert.equal(mapServerCartItem({ activityId: 'x', productId: 2 }), null);
    assert.equal(mapServerCartItem({ activityId: 1, productId: null }), null);
  });

  it('trims and slices note to at most 80 chars', () => {
    const text = ' a '.repeat(50);
    const item = mapServerCartItem({ activityId: 1, productId: 2, note: text });
    assert.equal(item?.note.length <= 80, true);
    assert.equal(item?.note.startsWith('a '), true);
  });
});

describe('mapServerCart', () => {
  it('normalizes each item and filters invalid entries', () => {
    const cart = {
      items: [
        {
          id: 1,
          activityId: '8',
          productId: '9',
          note: 'good',
          activityIsPreOrder: false,
          officialShippingStartTime: '2026-08-01',
          officialShippingEndTime: '2026-08-10'
        },
        { id: 2, activityId: 'bad', productId: 2, note: 'bad' },
        { id: 3, activityId: 8, productId: 12, info: 'info' }
      ]
    };

    const result = mapServerCart(cart);

    assert.equal(result.length, 2);
    assert.equal(result[0].activityId, 8);
    assert.equal(result[1].activityId, 8);
    assert.equal(result[0].activityIsPreOrder, false);
    assert.equal(result[0].officialShippingStartTime, '2026-08-01');
    assert.equal(result[1].officialShippingEndTime, undefined);
  });
});

describe('mapCartGroups', () => {
  it('groups by numeric activityId and keeps order metadata', () => {
    const items = mapServerCart({
      items: [
        {
          id: 1,
          activityId: 8,
          activityName: 'Act-8',
          productId: 1,
          price: 10,
          quantity: 2,
          activityIsPreOrder: true,
          officialShippingStartTime: '2026-08-01',
          officialShippingEndTime: '2026-08-10'
        },
        {
          id: 2,
          activityId: 8,
          activityName: 'Act-8',
          productId: 2,
          price: 5,
          quantity: 1,
          activityIsPreOrder: true
        },
        {
          id: 3,
          activityId: 11,
          activityName: 'Act-11',
          productId: 3,
          price: 7,
          quantity: 4,
          activityIsPreOrder: false,
          officialShippingStartTime: null,
          officialShippingEndTime: null
        }
      ]
    });

    const groups = mapCartGroups(items);

    assert.equal(groups.length, 2);
    assert.equal(groups[0].activityId, 8);
    assert.equal(groups[0].activityIsPreOrder, true);
    assert.equal(groups[0].officialShippingStartTime, '2026-08-01');
    assert.equal(groups[0].subtotal, 25);
    assert.equal(groups[0].totalQuantity, 3);
    assert.equal(groups[1].activityId, 11);
    assert.equal(groups[1].activityIsPreOrder, false);
    assert.equal(groups[1].officialShippingStartTime, null);
  });
});
