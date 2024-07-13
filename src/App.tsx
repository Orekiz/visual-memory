/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import './App.css'
interface ChoosedBlocks {
  [key: number]: ChoosedBlocksItem
}

interface ChoosedBlocksItem {
  correct: boolean
}
function App() {
  const [level, setLevel] = useState(1)
  const [HP, setHP] = useState(3)
  const [widthCount, setWidthCount] = useState(3)
  const increaseWidthLevels = [3, 6, 9, 12]
  const [memoryBlocks, setMemoryBlocks] = useState<number[]>([])
  const [showMemoryBlocks, setShowMemoryBlocks] = useState<number[]>([])
  const [choosedBlocks, setChoosedBlocks] = useState<ChoosedBlocks>({})
  const [choosedErrorCount, setChoosedErrorCount] = useState(0)
  const [isRemOver, siro] = useState(false)
  const [isShowWin, setIsShowWin] = useState(false)
  const [isShowFail, setIsShowFail] = useState(false)
  const initialMount = useRef(true)
  const memoryTime = 1850

  const stylea = {
    gridTemplateColumns: `repeat(${widthCount}, 1fr)`,
    gridTemplateRows: `repeat(${widthCount}, 1fr)`,
    gap: `${1/(widthCount/3)/2}rem`,
  }

  const [isUserStart, setIsUserStart] = useState(false)
  const handleClickStart = () => {
    setIsUserStart(true)
    start()
  }

  const gen = (memoryBlockCount: number) => {
    return new Promise<void>((resolve) => {
      siro(false)
      const memoryBlocks:number[] = Array.from({ length: memoryBlockCount })
      for(const i in memoryBlocks) {
        let randomNum = Math.floor(Math.random() * Math.pow(widthCount, 2))
        // 不能有重复的memoryBlock
        while(memoryBlocks.includes(randomNum))
          randomNum = Math.floor(Math.random() * Math.pow(widthCount, 2))
        memoryBlocks[i] = randomNum
      }
      const timer = setTimeout(() => {
        setMemoryBlocks(memoryBlocks)
        setShowMemoryBlocks(memoryBlocks)
        clearTimeout(timer)
        resolve()
      }, 1000)
    })
  }
  const memoryBlockCount = () => {
    return level + 2
  }
  const start = async () => {
    // 清空 展示记忆方块,用户选择的方块,错误次数
    setShowMemoryBlocks([])
    setChoosedBlocks({})
    setChoosedErrorCount(0)
    await gen(memoryBlockCount())
    const timer = setTimeout(() => {
      setShowMemoryBlocks([])
      siro(true)
      clearTimeout(timer)
    }, memoryTime)
  }

  const update = async () => {
    await showWin()
    setLevel(level + 1)
  }

  const showWin = () => {
    return new Promise<void>((resolve) => {
      siro(false)
      setIsShowWin(true)
      const timer = setTimeout(() => {
        setIsShowWin(false)
        clearTimeout(timer)
        resolve()
      }, 1000)
    })
  }

  const increaseWidthCount = () => {
    setWidthCount((widthCount) => widthCount + 1)
  }
  // 在更新level的时候, 自动触发gen
  useEffect(() => {
    if (initialMount.current)
      initialMount.current = false
    else {
      // 判断是否在需要增加格子宽度的等级上
      if (increaseWidthLevels.includes(level)) {
        increaseWidthCount()
      }
      start()
    }
  }, [level])

  const handleChooseBlock = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRemOver) {
      return
    }
    const index = parseInt(e.currentTarget.dataset.index??'')
    if (index === undefined || isNaN(index)) {
      return
    }
    checkChoosedBlocks(index)
  }

  const checkChoosedBlocks = (index: number) => {
    // 判断用户选择的方块 是否是记忆方块
    if (memoryBlocks.includes(index)) {
      // 是
      setChoosedBlocks((choosedBlocks) => {
        const newChoosedBlocks = { ...choosedBlocks }
        newChoosedBlocks[index] = { correct: true }
        let correctCount = 0
        for (const choosedBlock in newChoosedBlocks) {
          if (newChoosedBlocks[choosedBlock].correct)
            correctCount++
        }
        if (correctCount === memoryBlockCount())
          update()
        return newChoosedBlocks
      })
    } else {
      // 增加错误次数
      setChoosedBlocks((choosedBlocks) => {
        const newChoosedBlocks = { ...choosedBlocks }
        if (!choosedBlocks[index]) {
          setChoosedErrorCount(choosedErrorCount + 1)
          newChoosedBlocks[index] = { correct: false }
        }
        return newChoosedBlocks
      })
    }
  }

  // 当错误次数改变的时候自动判断
  useEffect(() => {
    if (choosedErrorCount >= 3) {
      fail()
    }
  }, [choosedErrorCount])

  const fail = async () => {
    await showFail()
    const newHP = HP - 1
    setHP(newHP)
    if (newHP)
      start()
    else
      end()
  }

  const showFail = () => {
    return new Promise<void>((resolve) => {
      siro(false)
      setIsShowFail(true)
      const timer = setTimeout(() => {
        setIsShowFail(false)
        clearTimeout(timer)
        resolve()
      }, 1000)
    })
  }

  const end = () => {
    alert(`游戏结束! 最终等级：${level}`)
    // 全部回到初始状态
    setLevel(1)
    setHP(3)
    setWidthCount(3)
    setIsUserStart(false)
    setChoosedBlocks({}) 
    initialMount.current = true
  }

  return (
    <>
      <h1 className='text-center font-bold text-lg'>Visual Memory Test<br /> 视觉记忆测试</h1>
      <section className={`w-screen mt-4 p-4 relative flex flex-col items-center gap-4 ${isShowWin ? 'bg-green-400/30' : ''} ${isShowFail ? 'bg-red-400/30' : ''} transition`}>
        {
          !isUserStart &&
          <div className='absolute top-0 left-0 w-full h-full bg-slate-900/70 backdrop-blur-2xl flex gap-8 justify-center items-center'>
            <div>
              <p className='max-w-96'>规则如下： <br />开始后矩阵内会 <span className='inline-block bg-slate-600/90 px-1 rounded-xl'>随机</span> 出现一些 <span className='inline-block bg-slate-600/90 px-1 rounded-xl'>高亮色块</span> ，需要你记住他的位置。记忆时间结束后，高亮色块消失，需要你点选出高亮色块 <span className='inline-block bg-slate-600/90 px-1 rounded-xl'>之前出现的位置</span>。</p>
              <p className='max-w-96'>The rules are as follows: <br />
              When you start, some <span className='inline-block bg-slate-600/90 px-1 rounded-xl'>highlighted</span> color blocks will appear <span className='inline-block bg-slate-600/90 px-1 rounded-xl'>randomly</span> in the matrix, and you need to memorize their positions. At the end of the memorization time, the highlighted color blocks disappear and you need to pick the position where the highlighted color block  <span className='inline-block bg-slate-600/90 px-1 rounded-xl'>appeared before</span> .</p>
            </div>
            <div>
              <p>单击下方按钮开始游戏。<br /> click the button bellow to start the game.</p>
              <button onClick={handleClickStart} className='px-4 py-2 bg-slate-600 hover:bg-slate-400 rounded'>开始 / START</button>
            </div>
          </div>
        }
        <p className='font-bold'>Level/关卡等级: { level } , HP/血条: { HP }</p>
        <div className='w-96 h-96 grid' style={stylea}>
          {
            Array.from({ length: Math.pow(widthCount, 2) }).map((_, j) => {
              return (
                <div key={j} 
                data-index={j}
                onClick={handleChooseBlock}
                className={`w-full h-full rounded ${showMemoryBlocks.includes(j) ? 'bg-slate-600' : ''} ${choosedBlocks[j] ? (choosedBlocks[j].correct ? 'bg-slate-600' : 'bg-red-300/80') : 'bg-slate-400'} ${isRemOver ? 'cursor-pointer' : ''} transition`}>
                </div>
              )
            })
          }
        </div>
      </section>
    </>
  )
}

export default App
