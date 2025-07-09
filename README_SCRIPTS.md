# AutoGen Studio 管理脚本说明

这些脚本帮助你快速管理 AutoGen Studio 服务。

## 📁 脚本文件

### 🔄 `restart_autogen.sh` - 重启服务
**功能**: 停止当前运行的 AutoGen Studio 服务并重新启动
```bash
./restart_autogen.sh
```

### ▶️ `start_autogen.sh` - 启动服务
**功能**: 启动 AutoGen Studio 服务
```bash
./start_autogen.sh
```

### ⏹️ `stop_autogen.sh` - 停止服务
**功能**: 停止正在运行的 AutoGen Studio 服务
```bash
./stop_autogen.sh
```

## 🚀 使用方法

### 常用操作：

1. **第一次启动**：
   ```bash
   ./start_autogen.sh
   ```

2. **重启服务**（最常用）：
   ```bash
   ./restart_autogen.sh
   ```

3. **停止服务**：
   ```bash
   ./stop_autogen.sh
   ```

### 访问地址：

- **主页**: http://127.0.0.1:8080
- **设置页面**: http://127.0.0.1:8080/settings （汉化功能在这里）
- **构建页面**: http://127.0.0.1:8080/build

## ⚙️ 配置信息

- **端口**: 8080
- **应用目录**: ./my-app
- **项目目录**: /home/hezongxi/下载/autogen-main

## 🔧 脚本功能

### `restart_autogen.sh` 详细功能：
1. ✅ 查找并关闭所有 autogenstudio 进程
2. ✅ 检查并释放端口 8080
3. ✅ 强制关闭顽固进程（使用 kill -9）
4. ✅ 等待端口完全释放
5. ✅ 重新启动服务
6. ✅ 彩色输出，清晰显示操作状态

### 安全特性：
- 🛡️ 优雅关闭进程（先尝试 SIGTERM，再使用 SIGKILL）
- 🛡️ 检查进程是否真正关闭
- 🛡️ 确保端口完全释放后再启动
- 🛡️ 错误处理和状态提示

## 🐛 故障排除

如果遇到问题：

1. **端口被占用**：
   ```bash
   # 查看占用端口的进程
   lsof -i:8080
   
   # 强制停止
   ./stop_autogen.sh
   ```

2. **权限问题**：
   ```bash
   # 确保脚本有执行权限
   chmod +x *.sh
   ```

3. **进程卡死**：
   ```bash
   # 查看所有相关进程
   ps aux | grep autogen
   
   # 手动清理
   pkill -f autogenstudio
   ```

## 💡 提示

- 使用 `./restart_autogen.sh` 是最安全和便捷的重启方式
- 脚本会自动处理端口冲突和进程清理
- 所有操作都有彩色提示，方便查看状态
- 服务启动后按 `Ctrl+C` 可以优雅停止

享受你的汉化版 AutoGen Studio！🎉