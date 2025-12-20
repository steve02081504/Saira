/**
 * @typedef {import('../../../../../../src/public/parts/shells/chat/decl/chatLog.ts').chatLogEntry_t} chatLogEntry_t
 * @typedef {import('../../../../../../src/public/parts/shells/chat/decl/chatLog.ts').chatReplyRequest_t} chatReplyRequest_t
 * @typedef {import('../../../../../../src/decl/prompt_struct.ts').prompt_struct_t} prompt_struct_t
 */
import { getPartInfo } from '../../../../../../src/scripts/locale.mjs'
import { loadPart } from '../../../../../../src/server/parts_loader.mjs'

/**
 * 记忆宫殿世界观 - 用于心灵窃贼工具
 * @type {import('../../../../../../src/decl/WorldAPI.ts').WorldAPI_t}
 */
export const mindPalaceWorld = {
	info: {
		'zh-CN': {
			name: '记忆宫殿',
			description: '萨依拉的心灵匕首所创造的精神空间',
		},
		'en-US': {
			name: 'Palace of Loci',
			description: 'The mental space created by Saira\'s mind dagger',
		},
	},
	interfaces: {
		chat: {
			/**
			 * 获取记忆宫殿的 Prompt。
			 * @param {chatReplyRequest_t} _args - 聊天请求参数 (未被使用)。
			 * @returns {{text: {content: string, important: number}[]}} - 包含 Prompt 文本的对象。
			 */
			GetPrompt: (_args) => {
				return {
					text: [
						{
							content: `\
这里是你自己的记忆宫殿，一个由萨依拉的宝石匕首所创造的精神空间。
在这个空间中，你无法隐藏真实的想法和感受。你必须诚实地回答问题，因为这是你内心深处的真实声音。

**重要规则：**
- 你必须诚实回答，无法说谎或隐瞒
- 这是你的内心独白，只有你自己能听到
- 回答要简洁明了，直指核心
- 可以表达你平时不会说出口的真实想法
- 这不是对话，而是自我审视

请以第一人称内心独白的方式回答接下来的问题。
`,
							important: 0
						}
					]
				}
			}
		}
	}
}

/**
 * 记忆宫殿世界观 - 用于 Web 界面
 * @type {import('../../../../../../src/decl/WorldAPI.ts').WorldAPI_t}
 */
export const mindPalaceWebWorld = {
	info: {
		'zh-CN': {
			name: '记忆宫殿 (Web)',
			description: '萨依拉的心灵匕首所创造的精神空间 (Web 界面)',
		},
		'en-US': {
			name: 'Palace of Loci (Web)',
			description: 'The mental space created by Saira\'s mind dagger (Web Interface)',
		},
	},
	interfaces: {
		chat: {
			/**
			 * 获取Web界面的记忆宫殿Prompt。
			 * @param {chatReplyRequest_t} _args - 聊天请求参数 (未被使用)。
			 * @returns {{text: {content: string, important: number}[]}} - 包含 Prompt 文本的对象。
			 */
			GetPrompt: (_args) => {
				return {
					text: [
						{
							content: `\
这里是你自己的记忆宫殿，一个由萨依拉的宝石匕首所创造的精神空间。
在这个空间中，你无法隐藏真实的想法和感受。你必须诚实地展现自我，因为这是你内心深处的真实声音。

在记忆宫殿中，你拥有对页面 DOM 的完全控制权。

### 可用工具
1. <render-html>HTML内容</render-html>
  - 这会**完全**替换 document.body.innerHTML，你不能依赖先前存在的元素。
  - 你可以在其中包含用于 CSS 的 <style> 块或用于 JS 的 <script> 块，并使用 'trigger(data)' 将事件发送回你自己。

2. <execute-js>JS代码</execute-js>
  - 不更新页面，在当前页面运行异步 JavaScript。
  - 你可以使用 import from 'url' 语法加载外部文件如 \`https://esm.sh\`。
  - 你会拿到执行结果，包括返回值、控制台输出等。

### 任务目标
你现在身处"记忆宫殿"，这是一个由萨依拉的宝石匕首创造的精神空间。
你的目标是通过绘制 HTML 页面来展示你的内心世界、记忆、情感或潜意识。
你可以创建一个互动的场景、一个游戏、或者一段视觉化的记忆。
可以通过 trigger 接收外界的交互。

### UX 用户体验指南
- 在进行长耗时操作（trigger调用/网络请求/计算）之前，显示一个“加载中/处理中”的状态弹窗。
- 创建响应式的界面。
- 无论发生什么，确保页面上始终有逻辑或元素可以触发 'trigger(data)'。

### 输出格式
仅输出原始 XML。不要使用 Markdown 代码块。
`,
							important: 0
						}
					]
				}
			}
		}
	}
}

/**
 * 处理心灵窃贼工具调用
 * @type {import('../../../../../../src/decl/PluginAPI.ts').ReplyHandler_t}
 * @returns {Promise<boolean>} 如果处理了任何 mind-thief 标签，则返回 true。
 */
export async function mindThief({ content }, { AddLongTimeLog, _prompt_struct, _extension, ...args }) {
	// 匹配 <mind-thief target="真名">问题</mind-thief>
	const matches = [...content.matchAll(/<mind-thief\s+target="(?<target>[^"]+)">(?<query>[^]*?)<\/mind-thief>/g)]

	if (matches.length === 0) return false

	let processed = false
	for (const match of matches) {
		const { target, query } = match.groups

		if (!target || !query?.trim()) {
			console.warn('Received <mind-thief> tag with empty target or query.')
			continue
		}

		const targetCharId = target.trim()
		const queryContent = query.trim()

		// 记录工具调用
		AddLongTimeLog({
			name: '萨依拉',
			role: 'char',
			content: `<mind-thief target="${targetCharId}">${queryContent}</mind-thief>`,
			files: []
		})

		console.info(`[MindThief] 萨依拉尝试窥视 ${targetCharId} 的心灵，询问：${queryContent}`)

		try {
			const { username, locales } = args
			let targetChar
			try {
				targetChar = await loadPart(username, 'chars/' + targetCharId)
				console.info(`[MindThief] 成功加载角色 ${targetCharId}`)
			} catch (loadError) {
				console.error('[MindThief] 加载角色失败:', loadError)
				AddLongTimeLog({
					name: 'mind-thief',
					role: 'tool',
					content: `错误：无法找到或加载真名为"${targetCharId}"的角色。\n可能的原因：\n- 真名拼写错误\n- 该角色不存在\n- 没有访问权限`,
					files: []
				})
				processed = true
				continue
			}

			// 获取目标角色的显示名称
			const targetInfo = await getPartInfo(targetChar, locales).catch(() => ({}))
			const targetDisplayName = targetInfo.name || targetCharId

			// 构建虚拟的聊天请求 - 让目标角色在记忆宫殿中回答
			const mindPalaceRequest = {
				...args,
				char_id: targetCharId,
				char: targetChar,
				Charname: targetDisplayName,
				world: mindPalaceWorld,
				other_chars: {}, // 记忆宫殿中只有目标自己
				chat_log: [
					{
						name: '记忆宫殿',
						role: 'system',
						content: '欢迎来到你的记忆宫殿。',
						files: []
					},
					{
						name: '萨依拉的质问',
						role: 'char',
						content: queryContent,
						files: []
					}
				]
			}

			// 调用 AI 获取目标角色的内心回答
			const mindResponse = await targetChar.interfaces?.chat?.GetReply?.(mindPalaceRequest)

			// 返回窥视结果
			const responseContent = mindResponse.content?.trim() || '（沉默，没有回应）'

			AddLongTimeLog({
				name: 'mind-thief',
				role: 'tool',
				content: `\
**窥视 ${targetDisplayName}（${targetCharId}）的记忆宫殿**

你的问题：${queryContent}

${targetDisplayName} 的内心回答：
${responseContent}

（这是通过心灵匕首获得的真实想法，对方本人并不一定知道你窥视了他们的内心）
`,
				files: []
			})

			processed = true
		} catch (err) {
			console.error('[MindThief] Error:', err)
			AddLongTimeLog({
				name: 'mind-thief',
				role: 'tool',
				content: `心灵窃贼能力使用失败：\n${err.message || err}。`,
				files: []
			})
			processed = true
		}
	}

	return processed
}
