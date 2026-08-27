"use strict"

/**
 * 卷摆高中（PaiSchool）- 前端渲染
 * 依赖 /common/client.js（send_action/on_update）与 data.js（SEATS/CARD_SLOTS/TRACK/MAP_W/MAP_H）
 *
 * 职责（框架最小集）：
 *   1. 加载地图：把 map.svg 放进 #map，坐标系 1200x1020 与 SVG viewBox 一一对应
 *   2. 绑定控制点：按 SEATS 坐标生成 90 个座位覆盖层，点击发送 seat 动作
 *   3. 悬停提示：座位 / 氛围轨道（背景条、刻度）/ 手牌槽位均有对应显示
 */

var myRole = null

var ui = {
	map: null,
	seats: {}, // seat_id -> 元素
	pointer: null,
}

const ZONE_NAMES = { elite: "学霸区", normal: "普通区", chill: "松弛区" }
const ROLE_NAMES = { Grade: "成绩派", Happy: "快乐派" }
const ROLE_BADGES = { Grade: "成", Happy: "乐" }
const SIDE_NAMES = { playerA: "玩家 A · 成绩派", playerB: "玩家 B · 快乐派" }
const KIND_NAMES = { studentCards: "学生卡", actionCards: "操作卡" }

// ---------- 初始化 ----------

function on_init(scenario, options, static_view) {
	myRole = params.role
	buildMap()
}

// 构建地图：底图 + 座位控制点 + 氛围轨道 + 卡牌槽位热区
function buildMap() {
	ui.map = document.getElementById("map")
	ui.map.replaceChildren()

	// 1. 底图
	const img = document.createElement("img")
	img.src = "map.svg"
	img.draggable = false
	ui.map.appendChild(img)

	// 2. 氛围轨道悬停热区（先铺底层）：背景条 + 各刻度
	const bar = TRACK.bar
	addHotspot(bar.x, bar.y, bar.width, bar.height,
		`班级氛围轨道\n-4 摆烂 ～ +4 内卷（当前：${format_track(view && view.track)}）`)
	for (const t of TRACK.ticks)
		addHotspot(t.x, t.y, t.width, t.height,
			`氛围刻度 ${t.value > 0 ? "+" + t.value : t.value}${t.value === -4 ? "（摆烂极端）" : t.value === 4 ? "（内卷极端）" : t.value === 0 ? "（中立）" : ""}`)

	// 3. 座位控制点（绝对定位覆盖层，坐标即 SVG 用户单位）
	for (const s of SEATS) {
		const el = document.createElement("div")
		el.className = "seat empty " + s.zone
		el.style.left = s.x + "px"
		el.style.top = s.y + "px"
		el.style.width = s.w + "px"
		el.style.height = s.h + "px"
		el.dataset.id = s.id

		const badge = document.createElement("span")
		badge.className = "badge"
		el.appendChild(badge)

		bind_seat_events(el, s)
		ui.map.appendChild(el)
		ui.seats[s.id] = el
	}

	// 4. 手牌槽位热区（框架阶段仅提示，不参与交互）
	for (const c of CARD_SLOTS)
		addHotspot(c.x, c.y, c.w, c.h,
			`${SIDE_NAMES[c.side]} · ${KIND_NAMES[c.kind]}\n第 ${c.index} 张牌位（暂未启用）`)

	// 5. 氛围轨道指针（三角形，指向当前刻度；位置在 set_track 中按 view 校正）
	ui.pointer = document.createElement("div")
	ui.pointer.className = "track-pointer"
	ui.pointer.innerHTML = '<svg width="14" height="12" viewBox="0 0 14 12"><polygon points="7,0 0,12 14,12" fill="#ff6b35"/></svg>'
	ui.map.appendChild(ui.pointer)
	set_track(0)
}

// 通用悬停热区：透明覆盖块 + 提示文本
function addHotspot(x, y, w, h, text) {
	const el = document.createElement("div")
	el.className = "hotspot"
	el.style.left = x + "px"
	el.style.top = y + "px"
	el.style.width = w + "px"
	el.style.height = h + "px"
	bind_tooltip(el, text)
	ui.map.appendChild(el)
	return el
}

// 座位交互：悬停提示 + 点击占座
function bind_seat_events(el, s) {
	el.addEventListener("mouseenter", (evt) => show_seat_tooltip(evt, el, s))
	el.addEventListener("mousemove", move_tooltip)
	el.addEventListener("mouseleave", hide_tooltip)
	el.addEventListener("mousedown", (evt) => {
		if (evt.button !== 0) return
		if (send_action("seat", s.id))
			evt.stopPropagation()
	})
}

function bind_tooltip(el, text) {
	el.addEventListener("mouseenter", (evt) => show_tooltip(evt, text))
	el.addEventListener("mousemove", move_tooltip)
	el.addEventListener("mouseleave", hide_tooltip)
}

// ---------- 更新（每次收到服务器视图时重绘） ----------

function on_update() {
	if (!ui.map)
		return

	const seats = (view && view.seats) || {}
	const actions = (view && view.actions) || {}
	const clickable = !!(actions.seat && actions.seat.length > 0)
	ui.map.classList.toggle("clickable", clickable)

	for (const s of SEATS) {
		const el = ui.seats[s.id]
		const owner = seats[s.id] || null
		el.classList.toggle("grade", owner === "Grade")
		el.classList.toggle("happy", owner === "Happy")
		el.classList.toggle("empty", !owner)
		el.classList.toggle("action", clickable && actions.seat.includes(s.id))
		el.querySelector(".badge").textContent = owner ? ROLE_BADGES[owner] : ""
	}

	if (typeof view.track === "number")
		set_track(view.track)

	update_sidebar()
}

function set_track(value) {
	if (!ui.pointer)
		return
	const tick = TRACK.ticks.find(t => t.value === value)
	if (!tick)
		return
	ui.pointer.style.left = tick.centerX + "px"
	ui.pointer.style.top = "36px"
}

function update_sidebar() {
	const counts = (view && view.counts) || { Grade: 0, Happy: 0 }
	document.getElementById("grade_stat").textContent =
		`座位 ${counts.Grade} / ${SEATS.length}`
	document.getElementById("happy_stat").textContent =
		`座位 ${counts.Happy} / ${SEATS.length}`

	const turn_text =
		(view.turn ? `第 ${view.turn} 学期 · ` : "") +
		`氛围：${format_track(view.track)}`
	document.getElementById("turn_info").textContent = turn_text
}

function format_track(v) {
	if (typeof v !== "number") return "-"
	if (v === 0) return "中立"
	return v > 0 ? `内卷 +${v}` : `摆烂 ${v}`
}

// ---------- 工具栏 ----------

// 隐藏/显示座位控制点覆盖层（便于查看底图）
function toggle_seats() {
	const btn = document.getElementById("seats_toggle_btn")
	const hidden = ui.map.classList.toggle("hide-pieces")
	btn.textContent = hidden ? "👁 显示控制点" : "🙈 隐藏控制点"
}

// ---------- 悬停提示 ----------

function show_seat_tooltip(e, el, s) {
	const seats = (view && view.seats) || {}
	const owner = seats[s.id]
	show_tooltip(e,
		s.desc +
		`\n区域：${ZONE_NAMES[s.zone]}` +
		(owner ? `\n控制：${ROLE_NAMES[owner]}` : "\n控制：无主"))
}

function show_tooltip(e, text) {
	const tip = document.getElementById("tooltip")
	tip.textContent = text
	tip.hidden = false
	move_tooltip_at(e)
}

function move_tooltip(e) {
	if (e && e.clientX !== undefined && !document.getElementById("tooltip").hidden)
		move_tooltip_at(e)
}

function move_tooltip_at(e) {
	const tip = document.getElementById("tooltip")
	let x = e.clientX + 14
	let y = e.clientY + 16
	const r = tip.getBoundingClientRect()
	if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - 10
	if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - 10
	tip.style.left = x + "px"
	tip.style.top = y + "px"
}

function hide_tooltip() {
	document.getElementById("tooltip").hidden = true
}
