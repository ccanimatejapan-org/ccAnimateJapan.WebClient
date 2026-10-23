// 功能旗標：集中管理「程式與語系檔都保留、但暫時不對外顯示」的功能。
// 只改這裡的值就能開關，不需要動各個 layout / 元件。

// 語言切換按鈕（LanguageSwitcher）。DefaultLayout 與 AuthLayout 都以 v-if 讀取此旗標。
// 目前隱藏；改成 true 即恢復（語系 store、i18n 與 en／zh-TW 語系檔皆維持原樣）。
export const SHOW_LANGUAGE_SWITCHER = false;
