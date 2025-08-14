<template>
  <div>
    <p>v-html 指令</p>
    <h2>基础使用</h2>
    <div v-html="richText"></div>
    <h2>xss 攻击</h2>
    <!-- v-html 面对图片的攻击 -->
    <button @click="changeHtml">开始攻击</button>
    <div v-if="isAttack" v-html="xssHtml"></div>
    <h2>测试插槽指令是不是自动转义</h2>
    <button @click="changeHtml2">开始攻击2</button>
    <div v-if="isAttack2">{{ xssHtml2 }}</div>
  </div>
  <!-- 评论中的 xss 攻击 -->
  <h2>评论中的 xss 攻击</h2>
  <div id="rich" style="border: 1px solid #000" contenteditable></div>
  <p>
    textarea 标签的内容：<textarea
      v-model="xssRichTextType"
      style="width: 100%"
    />
  </p>
  <button @click="saveRichText">保存富文本的内容到下面的 v-html进行保存</button>
  <div v-html="xssRichTextType"></div>
  <ul>
    <li>
      <p>
        使用 contenteditable的标签来获取到的 innerHTML
        由于浏览器自身的限制，会对标签进行转义。
      </p>
    </li>
    <li>
      <p>
        所以说document.getElementById("rich").innerHTML获取到的是"&lt;img
        src=\"x\" onerror=\"alert('XSS触发成功')\"&gt;"
      </p>
    </li>
    <li>
      <p>
        这样子自然而然的解决了 xss
        的攻击问题，因为浏览器会自动对标签进行转义，所以说不会触发 xss 攻击。
      </p>
    </li>
    <li>
      <p>但是如果是通过 textarea 标签来获取到的 innerHTML 就会有问题</p>
    </li>
    <li>
      <p>因为 textarea 标签不会对标签进行转义，所以说会触发 xss 攻击。</p>
    </li>
  </ul>
</template>
<script setup>
import { computed, ref } from "vue";
import DOMPurify from "dompurify";

const html = ref("<h1>hello world</h1>");
const richText = ref(`
  <div style="font-family: Arial, sans-serif;">
    <h1 style="color: #333;">这是富文本标题</h1>
    <p>这是一段<strong>加粗文本</strong>和<em>斜体文本</em>。</p>
    <ul style="list-style-type: circle;">
      <li>列表项 1</li>
      <li>列表项 2</li>
    </ul>
    <p><a href="https://wyc7758775.github.io/yoran-secret/" style="color: blue;">这是一个链接</a></p>
  </div>
`);

// xss 攻击测试
const xssHtml = ref(
  `<img src="x" onerror="alert('XSS攻击成功!');window.location.href='https://wwww.baidu.com'">`
);
const isAttack = ref(false);
const changeHtml = () => {
  isAttack.value = true;
};

// 插值语法 自动转义标签
const xssHtml2 = ref(
  `<img src="x" onerror="alert('XSS攻击成功!');window.location.href='https://wwww.baidu.com'">`
);
const isAttack2 = ref(false);
const changeHtml2 = () => {
  isAttack2.value = true;
};

// 富文本中的 xss 攻击
const xssRichTextType = ref("");
// xss 实际应用
const xssRichText = ref("请输出内容");
const saveRichText = () => {
  const rawHTML = document.getElementById("rich").innerHTML;
  // console.log({ rawHTML }); // "&lt;img src=\"x\" onerror=\"alert('XSS触发成功')\"&gt;"
  // xssRichText.value = escapeHtml(rawHTML);
  xssRichText.value = xssRichTextType.value;
};

const sanitizedHtml = computed(() => DOMPurify.sanitize(xssRichText.value));
</script>
