---
date: 1970-01-01
tags: 
  - scala
---

# 来，学scala

应工作需要，学习一波scala

```scala
// hello.scala
object Hello {
  def main(args: Array[String]): Unit = {
    val list: List[Any] = List(
      'c',
      "string",
      666,
      true,
      () => "anonymous function"
    )
    list.foreach(el => println(el))
  }
}
```

```sh
scalac tmp/data/hello.scala -d ./tmp/data
scala -classpath tmp/data Hello
```

-d 指定输出的class文件的目录

-classpath 指定寻找class文件的路径

输出：  
c  
string  
666  
true  
Hello$$$Lambda$113/0x0000000800cb6840@4145bad

```scala
object Hello {
  def main(args: Array[String]): Unit = {
    var p = new Point
    println(p.x, p.y)
    p = new Point(y = 5)
    p.x = 1
    println(p)
  }
}

class Point(var x: Int = 0, var y: Int = 0) {
  override def toString: String = s"Point($x, $y)"
}
```

输出：  
(0,0)  
Point(1, 5)

```scala
import scala.collection.mutable.ArrayBuffer

object Hello {
  def main(args: Array[String]): Unit = {
    val zoo = new Zoo(to = 1)
    println(zoo.next)
    println(zoo.next)
  }
}

trait Iterator[A] {
  def next: A
}

trait Pet {
  val name: String
}

class Dog(val name: String) extends Pet {
  override def toString: String = s"Dog: $name"
}

class Zoo(to: Int) extends Iterator[Pet] {
  private var current = 0
  private val members = ArrayBuffer(new Dog("honey"))
  override def next: Pet = {
    val t = current
    current += 1
    if(t < to) members(t) else new Dog("out of bound")
  }
}
```

输出：  
Dog: honey  
Dog: out of bound

```scala
object Hello {
  def main(args: Array[String]): Unit = {
    val persons = List(("jinkai", 25), ("danhua", 27))
    persons.foreach {
      case ("jinkai", age) => println(s"jinkai's age is $age")
      case _ => println(s"danhua's age is ???")
    }
    for((name, age) <- persons) {
      println(s"person: name($name), age($age)")
    }
  }
}
```

输出：  
jinkai's age is 25  
danhua's age is ???  
person: name(jinkai), age(25)  
person: name(danhua), age(27)

```scala
object Hello {
  def main(args: Array[String]): Unit = {
    new RichStringIterator("Scala").foreach { println _ }
  }
}

abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next: T
}

class StringIterator(s: String) extends AbsIterator {
  type T = Char
  private var current = 0
  def hasNext: Boolean = current < s.length
  def next: Char = {
    val t = current
    current += 1
    s charAt t
  }
}

trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit): Unit = while(hasNext) f(next)
}

class RichStringIterator(s: String) extends StringIterator(s: String) with RichIterator
```

输出：  
S  
c  
a  
l  
a

```scala
object Hello {
  def main(args: Array[String]): Unit = {
    def factorial(x: Int): Int = {
      def fact(x: Int, accu: Int): Int = {
        if(x <= 1) accu else fact(x - 1, x * accu)
      }
      fact(x, 1)
    }
    println(factorial(2))
  }
}
```

输出：  
2

java 方言那么多，乱花渐欲迷人眼。公司一位前辈说过，重要的不是语言，是语言特性。从上面的栗子中，你看到了哪些语言特性？
