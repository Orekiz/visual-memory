提供一个Provider, VisualMemoryProvider。

Provider包裹的作用域内，可以使用 useVisualMemory() 获取 ~~VisualMemory对象~~ 获取一些属性和方法。

---

提供一个 VisualMemory 组件， 用于展示游戏的UI。

---

游戏需要的属性和方法：

0. start() 开始游戏的方法「调用生成记忆方块」
1. HP 生命值 number
2. Level 关卡等级 number
3. memoryTime 用于记忆的时间
4. widthCount 宽度格子数 number
5. increaseWidthLevels 增加宽度的关卡数 number[3, 6, 9]
6. update() 升级方法 「关卡数+1；判断新的关卡数是否在需要增加宽度的关卡数中，是就调用增夸宽度格子数方法；调用开始游戏方法」
7. memoryBlocksIndexes 记忆方块的index索引 number[]「比如increaseWidthCount()=3,就是有3个记忆方块,记录每个记忆方块的index」
8. increaseWidthCount() 增加宽度格子数的方法, +1即可
9. memoryBlockCount=()=>Level+2 记忆方块数的方法 「因为是动态的所以是方法」
10. generate() 生成记忆方块的方法
11. choosedBlock 用户选择的方块 index:number:{correct:boolean} 展示的时候 choosedBlock[index].correct?'active':'error'
12. handleChooseBlock() 用户选择记忆方块的方法 「将选择的方块的index加入choosedBlockIndexes」
13. checkChoosedBlock() 检查记忆方块的方法 「检查选中的方块是否是记忆方块」
14. isRememberOver 记忆是否结束 「记忆结束才能选择方块」
15. fail() 关卡失败的方法「还要判断HP，如果关卡失败但是还有HP,那就扣除HP然后重新开始这关（调用start()）HP没了就end()」
16. end() 游戏结束的方法 给出最后的关卡等级
17. showMemoryBlocks number[] 展示记忆方块的数组，生成记忆方块后复制一份给这个数组，页面根据这个数组来展示记忆方块，记忆的时间定时器后，将这个数组置空，用户然后设置isRememberOver true记忆结束，用户可以开始选择.
18. choosedErrorCount 选择错误的次数，checkChoosedBlock()方法中，如果用户选错了，增加此变量，如果此变量达到3，就调用fail


想法：
1. 方块的active类， 展示的时候
