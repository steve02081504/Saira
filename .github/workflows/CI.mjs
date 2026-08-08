/* global fountCharCI */
const CI = fountCharCI

await CI.test('GetGreeting', async () => {
	const greeting = await CI.char.interfaces.chat.GetGreeting({ chat_log: [] }, 0)
	CI.assert(typeof greeting?.content === 'string' && greeting.content.length > 0, `expected non-empty greeting, got: ${JSON.stringify(greeting)}`)
})

await CI.test('GetGroupGreeting', async () => {
	const greeting = await CI.char.interfaces.chat.GetGroupGreeting({ chat_log: [] }, 1)
	CI.assert(typeof greeting?.content === 'string' && greeting.content.length > 0, `expected non-empty group greeting, got: ${JSON.stringify(greeting)}`)
})

await CI.test('GetPromptForOther', async () => {
	const prompt = await CI.char.interfaces.chat.GetPromptForOther({})
	CI.assert(Array.isArray(prompt?.text) && prompt.text.some(t => String(t.content || '').includes('萨依拉')), `expected Saira prompt, got: ${JSON.stringify(prompt)}`)
})

await CI.test('empty AIsource uses preferred default', async () => {
	await CI.char.interfaces.config.SetData({ AIsource: '', plugins: [] })
	const { reply } = await CI.runInput('Hello')
	CI.assert(typeof reply?.content === 'string' && reply.content.length > 0, `expected reply from preferred default or offline fallback, got: ${JSON.stringify(reply)}`)
})

await CI.test('Basic AI Response', async () => {
	await CI.char.interfaces.config.SetData({ AIsource: 'CI', plugins: [] })
	const { reply } = await CI.runInput('Hello')
	CI.assert(reply.content.includes('good morning'), 'Character failed to return the AI content correctly.')
})

await CI.test('palace-gate inline', async () => {
	await CI.char.interfaces.config.SetData({ AIsource: 'CI', plugins: [] })
	const reply = await CI.runOutput('想了解她吗？<inline-palace-gate>Someone</inline-palace-gate>')
	CI.assert(typeof reply?.content === 'string' && !reply.content.includes('<inline-palace-gate>'), `expected palace gate rewritten, got: ${JSON.stringify(reply)}`)
	CI.assert(reply.content.includes('记忆宫殿') || reply.content.includes('palace'), `expected palace link text, got: ${JSON.stringify(reply)}`)
})
