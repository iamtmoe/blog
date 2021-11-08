---
date: 1970-01-01
tags: 
  - 代码规范
---

# 一次readable code实践

公司 code review 以《The Art of Readable Code》为标准，所以抽空读了下这本书（顺便分享一个免费英文电子书下载网站：<http://zh.booksc.org/>）。书中提倡一个关键理念
> code should be easy to understand

换句话说

> code should be written to minimize the time it would take for someone else to understand it

书中主要内容分三个部分：

1. 表面级别的改进

    - 选择好的名字
    - 写好的注释
    - 整齐地格式化代码

2. 简化逻辑

    - 利用return和continue减少嵌套，使控制流清晰
    - 拆解巨型表达式
    - 除去不必要的变量/减小变量作用域/优先使用常(write-once)变量

3. 重新组织代码

    - 提取主目标不相关的到单独的函数
    - 一块代码只做一件事
    - 用自然语言描述理清思路
    - 尽量少写代码

针对每个建议作者都举了一些例子加以阐明，具体就不展开了。学以致用，我翻出旧时的一个js文件决定实践一下。原先的代码是这样的

```js
function queens(n) {
    const queens = []
    res = find(1, 1)
    return res
    function find(row, column) {
        let pos = null
        for(let i = column; i <= n; i++) {
            if(!judgeConflict(row, i)) {
                pos = [row, i]
                break
            }
        }
        if(pos) {
            queens.push(pos)
            if(queens.length == n) {
                return queens
            } else {
                return find(pos[0] + 1, 1)
            }
        } else {
            let lastPos = queens.pop()
            if(lastPos[1] == n) {
                if(queens.length == 0) return 'Not found'
                lastPos = queens.pop()
            }
            return find(lastPos[0], lastPos[1] + 1)
        }
    }
    function judgeConflict(row, column) {
        return queens.some(pos => {
            return (
                pos[0] == row ||
                pos[1] == column ||
                Math.abs(pos[0] - row) == Math.abs(pos[1] - column)
            )
        })
    }
}
```

（八皇后问题是数学史上有名的问题，也是回溯法的经典应用案例）

应用上面学到的知识，我一番操作后，代码变成了这样

```js
function getQueenPositions(queenNum) {
    const positions = []
    return findOnNextRow(1, 1)
    function findOnNextRow(row, column) {
        /**
         * 在当前行找到合适的位置，
         * 找到：
         *  没找全：继续查找下一行，
         *  找全：返回位置数组
         * 找不到：
         *  上一行皇后不是最后一列：在上一行皇后列之后重找
         *  上一行皇后已经是最后一列：
         *    有上上一行：在上上一行重找
         *    没有上上一行：返回'not found'，
         */
        for(let i = column; i <= queenNum; i++) {
            if(!conflictWithOthers(row, i)) {
                positions.push([row, i])
                if(positions.length == queenNum) return positions
                return findOnNextRow(row + 1, 1)
            }
        }
        let lastPos = positions.pop()
        if(lastPos[1] == queenNum) {
            if(positions.length == 0) return 'Not found'
            lastPos = positions.pop()
        }
        return findOnNextRow(lastPos[0], lastPos[1] + 1)
    }
    function conflictWithOthers(row, column) {
        return positions.some(pos => {
            return (
                pos[0] == row ||
                pos[1] == column ||
                Math.abs(pos[0] - row) == Math.abs(pos[1] - column)
            )
        })
    }
}
```

总体上我竟不能确定是优化还是劣化图片。大致作了以下修改：

- 标识符更具体明确，如queens改为positions，n改为queenNum
- findOnNextRow增加了算法描述注释
- 除去了变量pos
- 去掉了else,减少了嵌套

你们觉得后者更容易理解了吗？

最后换红宝石皮肤

```ruby
require 'json'
class QueenGame
  def initialize
    @search_rsts_cache = {}
  end

  def search_solution(queen_num)
    return JSON.parse @search_rsts_cache[queen_num] if @search_rsts_cache[queen_num]
    @queen_num = queen_num
    @positions = []
    next_row, next_col = 1, 1
    while true
      search_rst, next_row, next_col = find_on_next_row next_row, next_col
      break unless search_rst == 1
    end
    @search_rsts_cache[queen_num] = search_rst == 0 ? (JSON @positions) : "Not found"
    @search_rsts_cache[queen_num]
  end

  private

  def find_on_next_row(row, column)
    return 1, row, column if caller.size > 5000
    (column..@queen_num).each do |i|
      next if conflict_with_others row, i

      @positions.push [row, i]
      return 0 if @positions.length == @queen_num

      return 1, row + 1, 1
    end
    last_pos = @positions.pop
    if last_pos[1] == @queen_num
      return 2 if @positions.empty?

      last_pos = @positions.pop
    end
    return 1, last_pos[0], last_pos[1] + 1
  end

  def conflict_with_others(row, column)
    @positions.any? do |pos|
      pos[0] == row ||
        pos[1] == column ||
        (pos[0] - row).abs == (pos[1] - column).abs
    end
  end
end
puts QueenGame.new.search_solution(8).inspect

require "minitest/autorun"

class QueenGameTest < Minitest::Test
  def setup
    @queen_game = QueenGame.new
  end

  def test_that_have_solution
    assert_equal [[1, 2], [2, 4], [3, 1], [4, 3]], (JSON.parse @queen_game.search_solution(4))
  end

  def test_that_not_found
    assert_equal "Not found", @queen_game.search_solution(3)
  end
end
```

当然不仅仅是换肤那么简单，还做了以下修改：

- ruby是比较纯粹的面向对象语言，所以用类的方式编写。
- 增加了结果缓存。对于昂贵的计算，这是个好习惯。
- 将递归改为迭代。如果用递归的话，当皇后数为16时，栈帧将溢出（上万，ruby可以用caller.size获取）。
- 增加了测试

欢迎批评指正。
