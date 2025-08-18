<font style="color:rgb(0, 0, 0);">Code Review就是将自己的代码公开的给其他程序员审查的过程。Reviewer和Reviewee之间主要是通过comment来进行沟通，comment可以针对每一行来进行评论。</font>

<font style="color:rgb(0, 0, 0);">熟悉同事在编程时的思考方式，这样其余同事以后如果有需要就可以更轻松、快速的修改代码。</font>

<font style="color:rgb(0, 0, 0);">向同事介绍修改了哪些文件，增加了什么样的功能，这样在问题出现时，可以保证至少有两个人可以帮助诊断、解决问题。</font>

## <font style="color:rgb(0, 0, 0);">一、评审模板</font>
### <font style="color:rgb(0, 0, 0);">1.1 选择对应的标签</font>
![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704007605452-078202ed-ca9d-406d-b0a6-1a1475468e12.png)

### <font style="color:rgb(0, 0, 0);">1.2 comment规范</font>
+ <font style="color:rgb(0, 0, 0);">[必要]我建议这里可以更改为函数forEach用户，这个更加的复合规范</font>
+ <font style="color:rgb(0, 0, 0);">[建议]这里的判断为了应对之后的扩展，可以考虑使用策略模式</font>
+ <font style="color:rgb(0, 0, 0);">[疑问]为什么需要多加一个变量来进行判断</font>

### <font style="color:rgb(0, 0, 0);">1.3 "[]"中对应的含义如下：</font>
+ <font style="color:rgb(0, 0, 0);">[必要] ⇒ 必须要修改才能够通过</font>
+ <font style="color:rgb(0, 0, 0);">[建议] ⇒ 不修改也可以通过</font>
+ <font style="color:rgb(0, 0, 0);">[疑问] ⇒ 需要reviewee解释一下</font>

### <font style="color:rgb(0, 0, 0);">1.4 案例</font>
![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704007605531-f0001593-a743-44d0-b9b3-d8846d1cda0b.png)

<font style="color:rgb(0, 0, 0);">数字分别对应：</font>

1. <font style="color:rgb(0, 0, 0);">标签</font>
2. <font style="color:rgb(0, 0, 0);">当前评论是否已经解决</font>
3. <font style="color:rgb(0, 0, 0);">对于当前评论的建议等级</font>
4. <font style="color:rgb(0, 0, 0);">评论主体</font>

<font style="color:rgb(0, 0, 0);">推荐在评审设置的地方，将只有解决才可通过的勾选</font>

### <font style="color:rgb(0, 0, 0);">1.5 如何收集自己的评审信息</font>
1. <font style="color:rgb(0, 0, 0);">打卡TT，选择研发云聊天框</font>![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704007605460-00677f8e-a96d-415e-80bc-5318e6d2054e.png)
2. <font style="color:rgb(0, 0, 0);">打开聊天记录，输入‘【已解决】。’ ，主要是全角。这样搜索出来的结果就是和你相关的评审，可以加上日期来进行过滤。</font>![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704007605498-beb4f2a1-f1eb-47de-9452-e9a88d150f85.png)

## <font style="color:rgb(0, 0, 0);">二、Code Review 礼仪</font>
<font style="color:rgb(0, 0, 0);">代码质量包括这些内容：</font>

+ <font style="color:rgb(0, 0, 0);">人工检查代码格式化的漏网之鱼</font>
+ <font style="color:rgb(0, 0, 0);">是否存在重复</font>
+ <font style="color:rgb(0, 0, 0);">最佳实践，if else、参数过多、ES6、设计模式（怼人的理论基础是《重构-改善既有代码》）</font>
+ <font style="color:rgb(0, 0, 0);">命名可读性,能自我阐述的最好,英文用词尽量准确(命名是所有程序员的头痛之一)</font>
+ <font style="color:rgb(0, 0, 0);">注释,恰到好处的注释,重要的地方及时备注,不需要的地方要删除一定的注释信息,代码既是给机器运行的,也同时是交接给人看的.</font>
+ <font style="color:rgb(0, 0, 0);">代码是否健壮，是否可扩展</font>

<font style="color:rgb(0, 0, 0);">我们的目标是消灭下面这张图：</font>

![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704007605504-be64e3d8-8221-4b84-ba93-21d45ab19af6.png)

<font style="color:rgb(0, 0, 0);">同时，我们还需要注意一下礼仪。</font>

<font style="color:rgb(0, 0, 0);">Code Review的礼仪决定了你是否会被同事背后捅刀。主要是谨记一条原则：</font>

**<font style="color:rgb(0, 0, 0);">只针对代码不针对人</font>**<font style="color:rgb(0, 0, 0);">。</font>

**<font style="color:rgb(0, 0, 0);">对评审人员的建议</font>**<font style="color:rgb(0, 0, 0);">：</font>

+ <font style="color:rgb(0, 0, 0);">看不明白的时候，可以适当的提醒对方添加注释</font>
+ <font style="color:rgb(0, 0, 0);">看不明白的时候，是请教对方而不是责问对方</font>
+ <font style="color:rgb(0, 0, 0);">不管是明确修改的方案还是指出问题，给出自己的理由，依据，而不是感觉</font>
+ <font style="color:rgb(0, 0, 0);">评论的内容不要过于广泛</font>

<font style="color:rgb(0, 0, 0);">作为reviewer提出comment,目的是提升项目代码质量，而不是抨击别人，质疑别人的能力，应该保持平等友善的语气。</font>

<font style="color:rgb(0, 0, 0);">评论的内容广泛的问题，比如说，评论Reviewee的耦合度太高。这么的言论就很操蛋，我们需要提出的是具体的建议，可以给出具体的改进的伪代码。不然最好闭嘴。</font>

**<font style="color:rgb(0, 0, 0);">对提审人的建议:</font>**

+ <font style="color:rgb(0, 0, 0);">每次提交的代码量都尽可能的小</font>
+ <font style="color:rgb(0, 0, 0);">反驳一定需要给出的依据</font>
+ <font style="color:rgb(0, 0, 0);">相比评审人要更加的谦虚</font>

<font style="color:rgb(0, 0, 0);">第一点，为了方便审阅者可以轻松了解代码中有哪些更改以及做了什么。如果 code review 的内容足够少，则可以更频繁地进行，可能每天几次，而且更易于管理。</font>

<font style="color:rgb(0, 0, 0);">对于第二点，评审的人花了这么多时间给你来看代码。如果提出的建议能够改善你写的代码，或者直接指出了问题，提审人都是最大的受益者。</font>

**<font style="color:rgb(0, 0, 0);">话术的建议</font>**

| **<font style="color:rgb(0, 0, 0);">bad</font>** | **<font style="color:rgb(0, 0, 0);">good</font>** |
| --- | --- |
| <font style="color:rgb(0, 0, 0);">你要这么做</font> | <font style="color:rgb(0, 0, 0);">我建议这么做/这么干是否更加好</font> |
| <font style="color:rgb(0, 0, 0);">你写的代码比较差</font> | <font style="color:rgb(0, 0, 0);">这块代码写得比较差</font> |
| <font style="color:rgb(0, 0, 0);">你这里写得太坑了</font> | <font style="color:rgb(0, 0, 0);">重构里面提议这种情况应该提取函数</font> |


**<font style="color:rgb(0, 0, 0);">最重要的一点就是，不要吝啬你的夸奖！</font>**<font style="color:rgb(0, 0, 0);"><br />当你实在找不到问题的时候，多夸夸你的同事吧。这段代码设计得真好，这段代码性能提升得真高。当然，平时做人的时候也应该如此。</font>

