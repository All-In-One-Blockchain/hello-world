# 在Arbitrum的Rust初体验

> 今天早上起来[刷推](https://twitter.com/OffchainLabs/status/1697232795268177987?s=20)看到了arbitrum的测试网支持了Rust合约支持，看着感觉挺厉害的。今天晚上就试试能不能行。

这是官方网站上的[quickstart](https://docs.arbitrum.io/stylus/stylus-quickstart)的例子。下面我就用这个例子来做介绍。应该说大部分的内容都会是这里的内容吧。下面开始

## 准备条件



### Rust toolchain

因为是用rust语言写合约肯定你需要[安装](https://www.rust-lang.org/zh-CN/tools/install)Rust语言，参照官方的指南安装Rust语言。



### 编辑器

使用[zed](https://zed.dev/download)编辑器用习惯了，我是推荐mac用户使用zed。或者你也可以使用[vs code](https://code.visualstudio.com/)。

之后就是需要部署测试需要的测试token，这里我就直接翻译（GPT啊）官方的了。



### 测试网络ETH用于部署

您需要一些测试网络ETH来部署您的Rust合约进行实时测试。以下将进一步详细解释。

#### 开发者钱包/账户

在测试网络链上部署和交互时，使用一个不包含任何真实资产的新钱包非常重要。通常，您会将私钥作为CLI参数包含在内，以便以编程方式执行交易，因此请避免在开发过程中使用个人账户。

如果您正在使用[MetaMask](https://metamask.io/)，只需点击插件顶部中间的下拉菜单，然后点击“添加账户”来创建一个新账户。为了方便起见，可以将该账户标记为开发钱包或“Stylus”。您将需要这个新创建的账户的私钥（以及一些Sepolia ETH）来部署智能合约。请按照[MetaMask网站上的说明获取您的私钥](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)。

> 永远不要与任何人分享你的“秘密恢复短语”。永远不要在任何地方输入它。私钥仅对个人账户有效，但秘密恢复短语可以用来访问你钱包中的所有账户。

#### 测试网络ETH / Sepolia

Stylus测试网直接结算到[Arbitrum Sepolia测试网](https://docs.arbitrum.io/for-devs/concepts/public-chains#arbitrum-sepolia)。虽然Stylus测试网上没有直接的水龙头，但Arbitrum Sepolia上有。按照以下步骤可以在Stylus测试网上获得测试网ETH：

1. 导航至https://faucet.quicknode.com/arbitrum/sepolia
2. 连接您的钱包并选择Arbitrum Sepolia（注意：要使用此水龙头接收测试网ETH，您必须在以太坊主网上拥有0.001 ETH）
3. 点击继续，然后根据提示选择是否领取奖金，或确认领取正常金额。几分钟后，您现在应该拥有Arbitrum Sepolia ETH。
4. 导航到https://bridge.arbitrum.io/
5. 连接您的钱包
6. 点击个人资料下拉菜单，选择“设置”
7. 打开测试网络模式（注意：如果您已经连接到测试网络，请跳过此步骤）
8. 点击网络下拉菜单，选择Arbitrum Sepolia，这将将其设置为源网络
9. 点击目标链下拉菜单，选择 Stylus 测试网
10. 输入一定数量的ETH并进行桥接！



如需额外的测试网络ETH，请在L1主网上使用水龙头



https://sepoliafaucet.com/

https://www.infura.io/faucet/sepolia

https://sepolia-faucet.pk910.de/



## 正题 部署一个使用stylus的arbitum的Rust合约

![](https://docs.arbitrum.io/assets/images/cargo-stylus-ae896c1b0561abab7c92bd444910cb86.png)



在最新的arbitum的测试网现在是可以部署Stylus的智能合约了。

首先你需要安装`cargo-stylus` 这个工具，直接看官方的介绍。

> `cargo-stylus` 是我们用于辅助构建、验证和部署Rust中的Arbitrum Stylus程序的CLI工具。它作为标准 `Cargo` 工具的插件提供，可以轻松地集成到常见的Rust工作流中。

安装命令是:

```bash
cargo install --git https://github.com/OffchainLabs/cargo-stylus
```



你还需要安装[wasm](https://webassembly.org/)作为编译器的构建目标🎯

```bash
rustup target add wasm32-unknown-unknown
```

下面吗这个是执行`cargo stylus --help`的输出

```bash
Cargo command for developing Arbitrum Stylus projects

Usage: cargo stylus <COMMAND>

Commands:
  new         Initialize a Stylus Rust project using the https://github.com/OffchainLabs/stylus-hello-world template
  export-abi  Export the Solidity ABI for a Stylus project directly using the cargo stylus tool
  check       Instrument a Rust project using Stylus. This command runs compiled WASM code through Stylus instrumentation checks and reports any failures
  deploy      Instruments a Rust project using Stylus and by outputting its brotli-compressed WASM code. Then, it submits two transactions: the first deploys the WASM program to an address and the second triggers an activation onchain Developers can choose to split up the deploy and activate steps via this command as desired
  help        Print this message or the help of the given subcommand(s)

Options:
  -h, --help     Print help
  -V, --version  Print version
```

当然，这是各个命令的中文翻译：

- `new`：使用`https://github.com/OffchainLabs/stylus-hello-world`模板初始化一个Stylus Rust项目。
- `export-abi`：直接使用`cargo stylus`工具为Stylus项目导出Solidity ABI。
- `check`：使用Stylus对Rust项目进行工具化。该命令会运行经过Stylus工具化检查的编译后的WASM代码，并报告任何失败。
- `deploy`：使用Stylus对Rust项目进行工具化，并输出其经过brotli压缩的WASM代码。然后，它提交两个交易：第一个将WASM程序部署到一个地址，第二个触发链上激活。开发者可以根据需要通过这个命令分开部署和激活步骤。
- `help`：打印这条消息或给定子命令的帮助信息。



## 初始化一个合约项目

执行`cargo stylus new <your-proj-name>`。通过执行这个命令会初始化一个Rust合约。如命令介绍的那样，clone的官方的hello-world程序做的初始化。

### 检查您的 Stylus 项目是否有效

这里是直接按照官方的操作。

> 此命令将尝试通过指定 JSON-RPC 端点来验证您的程序是否可以在链上部署和激活，而无需交易。

```bash
cargo stylus check
```

这个命令会使用默认的`endpoint`的地址。通过执行`cargo stylus check --help`你会看到还可以有配置endpoint的选项。

如果上述命令失败，您将会看到关于为何您的WASM将被拒绝的详细信息：

```bash
Reading WASM file at bad-export.wat
Compressed WASM size: 55 B
Stylus checks failed: program predeployment check failed when checking against
ARB_WASM_ADDRESS 0x0000…0071: (code: -32000, message: program activation failed: failed to parse program)

Caused by:
    binary exports reserved symbol stylus_ink_left

Location:
    prover/src/binary.rs:493:9, data: None)

```

不管这里了 最后clone下来，运行最后肯定是可以成功的。

```bash
Finished release [optimized] target(s) in 1.88s
Reading WASM file at hello-stylus/target/wasm32-unknown-unknown/release/hello-stylus.wasm
Compressed WASM size: 3 KB
Program succeeded Stylus onchain activation checks with Stylus version: 1
```

当打算部署到链上去，你还可以提前知道花费的费用。

```bash
cargo stylus deploy \
  --private-key-path=<PRIVKEY_FILE_PATH> \
  --estimate-gas-only
```

这里需要你给出你部署合约的时候的使用的钱包的私钥文件📃。成功后会看到。

```bash
Compressed WASM size: 3 KB
Deploying program to address 0x457b1ba688e9854bdbed2f473f7510c476a3da09
Estimated gas: 12756792
```

后面我们把`--estimate-gas-only`去掉就是实际部署一个合约了。

```bash
cargo stylus deploy \
  --private-key-path=<PRIVKEY_FILE_PATH>
```

最终：

```
Compressed WASM size: 3 KB
Deploying program to address 0x457b1ba688e9854bdbed2f473f7510c476a3da09
Estimated gas: 12756792
Submitting tx...
Confirmed tx 0x42db…7311, gas used 11657164
Activating program at address 0x457b1ba688e9854bdbed2f473f7510c476a3da09
Estimated gas: 14251759
Submitting tx...
Confirmed tx 0x0bdb…3307, gas used 14204908
```

这个地址是我自己部署成功后在测试网的[**0x018544fcee109f5de1724b8c790f03d6bc65b278**](https://stylus-testnet-explorer.arbitrum.io/address/0x018544FcEe109f5dE1724B8c790F03D6bC65b278)

## 使用前端与合约交互

部署结束后，我们需要和我们的合约进行交互。和evm合约交互的标准是ABI。这里我们需要导出我们的abi格式。

通过使用`cargo stylus export-abi` 可以导出我们的abi 接口，通过这个接口你还需要转换成为一个json格式的abi规范调用接口。

```
Exporting Solidity ABI for Stylus Rust program in current directory
/**
 * This file was automatically generated by Stylus and represents a Rust program.
 * For more information, please see [The Stylus SDK](https://github.com/OffchainLabs/stylus-sdk-rs).
 */

interface Counter {
    function number() external view returns (uint256);

    function setNumber(uint256 new_number) external;

    function increment() external;
}
```

这是hello world合约的一个abi接口文件。

通过这个接口我们可以转换为这个abi.json格式

```json
{
  "constant": true,
  "inputs": [],
  "name": "number",
  "outputs": [{ "name": "", "type": "uint256" }],
  "type": "function"
},
{
  "constant": false,
  "inputs": [{ "name": "new_number", "type": "uint256" }],
  "name": "setNumber",
  "outputs": [],
  "type": "function"
},
{
  "constant": false,
  "inputs": [],
  "name": "increment",
  "outputs": [],
  "type": "function"
}
```

兼容以太坊生态的好处就是可以使用以太坊生态的工具🔧。

下面的代码是我使用ethers 调用合约成功的例子。

```ts
import { ethers, JsonRpcProvider } from "ethers";
import { config } from 'dotenv';

config();  // 加载.env文件

const abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "number",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "name": "new_number", "type": "uint256" }],
    "name": "setNumber",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "type": "function"
  }
];

const HELLO_WORLD_ADDRESS = "0x018544fcee109f5de1724b8c790f03d6bc65b278"; // 请替换为你的合约地址

const main = async () => {
  // 从环境变量中读取私钥
  const privateKey: string = process.env.PRIVATE_KEY || "";

  const provider = new JsonRpcProvider("https://stylus-testnet.arbitrum.io/rpc")

  const wallet = new ethers.Wallet(privateKey, provider)
  console.log("wallet", await wallet.getAddress());

  const contract = new ethers.Contract(HELLO_WORLD_ADDRESS, abi, provider);

  let currentNumber = await contract.number();
  console.log("Current number:", currentNumber.toString());

  const contractCanWrite = new ethers.Contract(HELLO_WORLD_ADDRESS, abi, wallet)
  // await contractCanWrite.setNumber(5);
  await contractCanWrite.increment();

  currentNumber = await contractCanWrite.number();
  console.log("New number:", currentNumber.toString());
}

main();
```

这个[地址](https://stylus-testnet-explorer.arbitrum.io/address/0x018544FcEe109f5dE1724B8c790F03D6bC65b278)记录📝了我交互成功的交易历史。

整体上来看，以太坊生态是越来越完善，在arbitum这种layer2上支持Rust语言写合约，详细会有更多的场景能够实现。



## 资源

- [erhers](https://www.wtf.academy/ethers-101/WriteContract/)
- [hello-world arbitrum Rust Smart Contract](https://github.com/All-In-One-Blockchain/hello-world)
