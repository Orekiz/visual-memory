提供一个Provider, VisualMemoryProvider。

Provider包裹的作用域内，可以使用 useVisualMemory() 获取 ~~VisualMemory对象~~ 获取一些属性和方法。

---

提供一个 VisualMemory 组件， 用于展示游戏的UI。

---

游戏需要的属性和方法：

1. HP 生命值 number
2. Level 关卡等级 number
3. memoryTime 用于记忆的时间
4. widthCount 宽度格子数 number
5. increaseWidthLevels 增加宽度的关卡数 number[3, 6, 9]
6. update() 升级方法 「关卡数+1；判断新的关卡数是否在需要增加宽度的关卡数中，是就调用增夸宽度格子数方法；调用生成记忆方块方法」
7. memoryBlocksCoordinate 记忆方块的坐标 Coordinate[] Coordinate{x:number, y:number}
8. increaseWidthCount() 增加宽度格子数方法, +1即可
9. memoryBlockCount=()=>Level+2 记忆方块数方法 「因为是动态的所以是方法」
10. generate() 生成记忆方块方法
