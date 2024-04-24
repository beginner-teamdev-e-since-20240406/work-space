# 三目並べゲーム (Tic Tac Toe)

このリポジトリは、HTML、CSS、JavaScriptを使用して実装された三目並べゲームです。プレイヤーはCPUと対戦することができ、先攻・後攻を選択できます。また、CPUの強さも選択可能で、つよつよモードとよわよわモードがあります。

## デモ動画
![demo-movie.gif](https://github.com/beginner-teamdev-e-since-20240406/work-space/blob/develop/GIF/demo-movie.gif)

## 遊び方

1. [Tic Tac Toe](https://team-e-202404.vercel.app/ "Tic Tac Toe")にアクセスします。
2. タイトル画面でゲームモードを選択します。
   - vsつよつよモード: 強いCPUと対戦します。先攻・後攻を選択できます。
   - vsよわよわモード: 弱いCPUと対戦します。先攻・後攻を選択できます。
3. ゲーム画面でマス目をクリックしてマークを配置します。
4. 勝利条件を満たすと、勝者が表示されます。
5. 「もう一度プレイ」ボタンをクリックして、再度ゲームを開始できます。

## 特徴

- プレイヤーはCPUと対戦できます。
- つよつよモードでは、ミニマックス法を使用した強いCPUと対戦できます。
- よわよわモードでは、ランダムな手を打つ弱いCPUと対戦できます。
- 勝利時にはアニメーションと効果音が再生されます。
- 引き分けの場合は、引き分けメッセージが表示されます。
- 背景にはOXのアニメーションが表示されます。

## ファイル構成

- `index.html`: ゲームのメインページです。
- `style.css`: ゲームのスタイルを定義しています。
- `script.js`: ゲームのロジックを実装しています。
- `歓声と拍手2.mp3`: 勝利時の効果音ファイルです。
- `「がんばりましょう」.mp3`: 敗北時の効果音ファイルです。
- `「また遊んでね」.mp3`: 引き分け時の効果音ファイルです。

## 依存関係

このゲームでは以下のライブラリを使用しています。

- Font Awesome: アイコンの表示に使用しています。
- canvas-confetti: 勝利時の紙吹雪アニメーションに使用しています。

## 開発者

- [alidha2024](https://github.com/alidha2024 "alidha2024")
- [genie-ru](https://github.com/genie-ru "Genie")
- [meb4427](https://github.com/meb4427 "meb4427")

## ライセンス

このプロジェクトは [MIT ライセンス](https://licenses.opensource.jp/MIT/MIT.html "The MIT License") の下で公開されています。