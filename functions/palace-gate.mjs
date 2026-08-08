/**
 * 记忆宫殿之门 - 内联工具
 * 将 <inline-palace-gate>角色ID</inline-palace-gate> 替换为指向该角色记忆宫殿的链接
 */

// 导入 Saira 的 charname
import { defineInlineToolUses } from '../../../../../../src/public/parts/shells/chat/src/streaming/index.mjs'
import { charurl } from '../main.mjs'
/**
 * 处理记忆宫殿之门的内联工具
 * @type {import('../../../../../../src/decl/PluginAPI.ts').ReplyHandler_t}
 */
export function palaceGateInline(result, args) {
	const regex = /<inline-palace-gate>(?<targetCharId>[^<]*?)<\/inline-palace-gate>/

	if (!result.content.match(regex)) return false

	try {
		const { content } = result
		const {
			extension,
			supported_functions,
			Charname,
			char_id,
			AddLongTimeLog,
		} = args
		const cachedResults = extension.streamInlineToolsResults?.['inline-palace-gate']

		let replacements
		if (cachedResults?.length)
			replacements = cachedResults.map(res => {
				if (res instanceof Error) throw res
				return res
			})
		else
			// 计算替换内容
			replacements = Array.from(result.content.matchAll(/<inline-palace-gate>(?<targetCharId>[^<]*?)<\/inline-palace-gate>/g))
				.map(match => {
					const targetCharId = match.groups.targetCharId.trim()
					if (!targetCharId) return '[记忆宫殿之门（未指定角色）]'

					// 生成 fount protocol URL
					// 路径使用 Saira 的 charname，查询参数使用目标角色的 ID
					const palacePath = `fount://page${charurl}/palace_of_loci`
					const targetQuery = `?target=${encodeURIComponent(targetCharId)}&api_base=${encodeURIComponent(`/api${charurl}`)}`
					const fullUrl = `https://steve02081504.github.io/fount/protocol?url=${encodeURIComponent(palacePath + targetQuery)}`

					if (supported_functions.html)
						return `\
<a href="${fullUrl}" target="_blank" style="text-decoration: none; color: inherit; display: inline-block; margin: 4px 0;">
	<div style="
		display: flex;
		align-items: center;
		padding: 8px 12px;
		background: rgba(139, 71, 137, 0.1);
		border: 1px solid rgba(139, 71, 137, 0.3);
		border-radius: 8px;
		transition: all 0.2s ease;
		cursor: pointer;
	" onmouseover="this.style.background='rgba(139, 71, 137, 0.2)'" onmouseout="this.style.background='rgba(139, 71, 137, 0.1)'">
		<div style="font-size: 20px; margin-right: 8px;">🔮</div>
		<div>
			<div style="font-weight: bold; font-size: 14px; color: #d4a5d1;">进入记忆宫殿</div>
			<div style="font-size: 12px; opacity: 0.8;">窥视 ${targetCharId} 的内心世界</div>
		</div>
	</div>
</a>
`

					if (supported_functions.markdown)
						return `[🔮 进入 ${targetCharId} 的记忆宫殿](${fullUrl})`

					return `[记忆宫殿链接: ${fullUrl}]`
				})

		let i = 0
		result.logContextBefore.push({
			name: Charname || char_id,
			role: 'char',
			content,
			files: result.files,
			charVisibility: [char_id],
		}, {
			name: 'palace-gate',
			role: 'tool',
			content: '记忆宫殿之门已生成\n',
			files: [],
			charVisibility: [char_id],
		})

		result.content = result.content.replace(/<inline-palace-gate>(?<targetCharId>[^<]*?)<\/inline-palace-gate>/g, () => replacements[i++])

		return false // 不需要重新生成
	} catch (error) {
		console.error('记忆宫殿之门生成失败：', error)
		args.AddLongTimeLog?.({
			name: args.Charname || args.char_id,
			role: 'char',
			content: result.content,
			files: result.files,
		})
		args.AddLongTimeLog?.({
			name: 'palace-gate',
			role: 'tool',
			content: `记忆宫殿之门生成失败：\n${error.stack}`,
			files: []
		})
		return true // 需要重新生成
	}
}

/**
 * 获取记忆宫殿之门的预览更新器
 * @returns {import('../../../../../../src/decl/PluginAPI.ts').GetReplyPreviewUpdater_t} 返回一个函数，该函数定义了内联工具的用途。
 */
export function GetPalaceGatePreviewUpdater() {
	return defineInlineToolUses([
		[
			'inline-palace-gate',
			'<inline-palace-gate>',
			'</inline-palace-gate>',
			(targetCharId, args) => {
				const { supported_functions } = args
				targetCharId = targetCharId.trim()
				if (!targetCharId) return '[记忆宫殿之门（未指定角色）]'

				// 路径使用 Saira 的 charname，查询参数使用目标角色的 ID
				const palacePath = `fount://page${charurl}/palace_of_loci`
				const targetQuery = `?target=${encodeURIComponent(targetCharId)}&api_base=${encodeURIComponent(`/api${charurl}`)}`
				const fullUrl = `https://steve02081504.github.io/fount/protocol?url=${encodeURIComponent(palacePath + targetQuery)}`

				if (supported_functions.html)
					return `\
<a href="${fullUrl}" target="_blank" style="text-decoration: none; color: inherit; display: inline-block; margin: 4px 0;">
	<div style="
		display: flex;
		align-items: center;
		padding: 8px 12px;
		background: rgba(139, 71, 137, 0.1);
		border: 1px solid rgba(139, 71, 137, 0.3);
		border-radius: 8px;
		transition: all 0.2s ease;
		cursor: pointer;
	" onmouseover="this.style.background='rgba(139, 71, 137, 0.2)'" onmouseout="this.style.background='rgba(139, 71, 137, 0.1)'">
		<div style="font-size: 20px; margin-right: 8px;">🔮</div>
		<div>
			<div style="font-weight: bold; font-size: 14px; color: #d4a5d1;">进入记忆宫殿</div>
			<div style="font-size: 12px; opacity: 0.8;">窥视 ${targetCharId} 的内心世界</div>
		</div>
	</div>
</a>
`.replaceAll('\n', '')

				if (supported_functions.markdown)
					return `[🔮 进入 ${targetCharId} 的记忆宫殿](${fullUrl})`

				return `[记忆宫殿链接: ${fullUrl}]`
			}
		]
	])
}
