importScripts("./extend-worker.ts");

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const generateMockData = (
  depth: number = 4,
  branches: number = 5
): TreeNode[] => {
  let counter = 0;

  const createNode = (currentDepth: number): TreeNode => {
    return {
      id: `node-${counter++}`,
      label: `节点 ${counter}`,
      children:
        currentDepth > 0
          ? Array.from({ length: branches }, () => createNode(currentDepth - 1))
          : undefined,
    };
  };

  return Array.from({ length: 10 }, (_, i) => ({
    id: `root-${i}`,
    label: `根节点 ${i + 1}`,
    children: Array.from({ length: branches }, () => createNode(depth - 1)),
  }));
};

self.onmessage = (e) => {
  console.log("Worker: Message received from main script");
  if (e.data.length < 2) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          // alert(xhr.responseText);
        } else {
          // alert("Request was unsuccessful: " + xhr.status);
        }
      }
    };
    xhr.open("get", "example.txt", true);
    xhr.send(null);
    postMessage("Please write two numbers");
  } else {
    const workerResult = "Result: " + e.data[0] * e.data[1];
    console.log("Worker: Posting message back to main script");
    postMessage({ workerResult, generateMockData: generateMockData() });
  }
};

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      // alert(xhr.responseText);
    } else {
      // alert("Request was unsuccessful: " + xhr.status);
    }
  }
};
xhr.open("get", "example.txt", true);
xhr.send(null);
