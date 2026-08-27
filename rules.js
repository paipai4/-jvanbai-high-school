"use strict"

/**
 * 卷摆高中（PaiSchool）- RTT 模块服务端入口
 *
 * 框架最小集（参考 Hannibal-Rome-vs-Carthage 的 setup/action/view 接口）：
 *   - 状态机只有一个 play 状态：双方轮流点击座位控制点放置阵营标记
 *   - 地图与坐标全在前端 data.js，这里只维护「哪个座位被谁控制」与氛围轨道值
 */

exports.roles = ["Grade", "Happy"]
exports.scenarios = ["Standard Game"]
exports.default_scenario = "Standard Game"

const ROLE_NAMES = { Grade: "成绩派", Happy: "快乐派" }

// 座位 id 全集：s{排1-5}_{列1-6}_{l左|m中|r右}，共 90 个（与前端 data.js 的 SEATS 一致）
const SEAT_IDS = []
for (let row = 1; row <= 5; ++row)
	for (let col = 1; col <= 6; ++col)
		for (const cell of ["l", "m", "r"])
			SEAT_IDS.push(`s${row}_${col}_${cell}`)

const other = (p) => (p === "Grade" ? "Happy" : "Grade")

exports.setup = function (seed, scenario, options) {
	const game = {
		seed,
		scenario,
		options: options || {},
		state: "play",
		active: "Grade",
		turn: 1,
		log: [],
		seats: {}, // seat_id -> "Grade" | "Happy"
		track: 0, // 班级氛围：-4 摆烂 ～ +4 内卷
	}
	game.log.push("游戏开始：双方轮流占领座位控制点。")
	game.log.push("轮到 成绩派 行动。")
	return game
}

exports.action = function (state, player, action, arg) {
	const game = state
	if (game.state === "game_over")
		return game

	if (action === "seat") {
		if (player !== game.active) {
			game.log.push(`[忽略] ${player} 在非本方回合尝试占座`)
			return game
		}
		if (typeof arg !== "string" || !SEAT_IDS.includes(arg)) {
			game.log.push(`[无效] 未知座位 ${arg}`)
			return game
		}
		if (game.seats[arg]) {
			game.log.push("[无效] 该座位已有主人")
			return game
		}
		game.seats[arg] = player
		game.log.push(`${ROLE_NAMES[player]} 占领了 ${arg}`)
		game.active = other(player)
		game.log.push(`轮到 ${ROLE_NAMES[game.active]} 行动。`)
		return game
	}

	if (action === "reset") {
		if (player !== game.active) {
			game.log.push("[忽略] 仅当前行动方可重置")
			return game
		}
		game.seats = {}
		game.track = 0
		game.turn = 1
		game.active = "Grade"
		game.log.push("** 已重置演示 **")
		game.log.push("轮到 成绩派 行动。")
		return game
	}

	game.log.push(`[无效动作] ${action}（状态 ${game.state}）`)
	return game
}

exports.view = function (state, player) {
	const game = state
	const counts = { Grade: 0, Happy: 0 }
	for (const id in game.seats)
		counts[game.seats[id]]++

	const view = {
		state: game.state,
		active: game.active,
		turn: game.turn,
		prompt: "",
		log: game.log,
		actions: null,
		seats: { ...game.seats },
		track: game.track,
		counts,
	}
	if (game.state === "game_over") {
		view.prompt = game.victory || "游戏结束"
		return view
	}

	if (game.active === player) {
		const empty = SEAT_IDS.filter((id) => !game.seats[id])
		view.actions = { seat: empty, reset: 1 }
		view.prompt = `请点击空座位放置控制点（剩余 ${empty.length} 个）`
	} else if (player === "Observer") {
		view.prompt = `观察中：等待 ${ROLE_NAMES[game.active]} 行动`
	} else {
		view.prompt = `等待对方行动……（${ROLE_NAMES[game.active]} 的回合）`
	}
	return view
}

exports.finish = function (state, result, message) {
	state.state = "game_over"
	state.active = "None"
	state.result = result
	state.victory = message
	state.log.push("")
	state.log.push(message)
	return state
}
