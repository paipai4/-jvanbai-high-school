"use strict"

/**
 * 卷摆高中（PaiSchool）地图数据
 * 由 鸽子坐标.json / 摆卷进度条.json 自动提取生成；面板坐标系 1200x1020（与 map.svg viewBox 一致）
 */
const MAP_W = 1200
const MAP_H = 1020

// 座位控制点：6 列 × 5 排，每桌 3 格（l 左 / m 中 / r 右），共 90 个
const SEATS = [
	{ id: "s1_1_l", x: 30, y: 145, w: 45, h: 60, zone: "normal", desc: "第1排第1列左格" },
	{ id: "s1_1_m", x: 75, y: 145, w: 45, h: 60, zone: "normal", desc: "第1排第1列中格" },
	{ id: "s1_1_r", x: 120, y: 145, w: 46, h: 60, zone: "normal", desc: "第1排第1列右格" },
	{ id: "s1_2_l", x: 174, y: 145, w: 45, h: 60, zone: "elite", desc: "第1排第2列左格" },
	{ id: "s1_2_m", x: 219, y: 145, w: 45, h: 60, zone: "elite", desc: "第1排第2列中格" },
	{ id: "s1_2_r", x: 264, y: 145, w: 46, h: 60, zone: "elite", desc: "第1排第2列右格" },
	{ id: "s1_3_l", x: 340, y: 145, w: 45, h: 60, zone: "elite", desc: "第1排第3列左格" },
	{ id: "s1_3_m", x: 385, y: 145, w: 45, h: 60, zone: "elite", desc: "第1排第3列中格" },
	{ id: "s1_3_r", x: 430, y: 145, w: 46, h: 60, zone: "elite", desc: "第1排第3列右格" },
	{ id: "s1_4_l", x: 484, y: 145, w: 45, h: 60, zone: "elite", desc: "第1排第4列左格" },
	{ id: "s1_4_m", x: 529, y: 145, w: 45, h: 60, zone: "elite", desc: "第1排第4列中格" },
	{ id: "s1_4_r", x: 574, y: 145, w: 46, h: 60, zone: "elite", desc: "第1排第4列右格" },
	{ id: "s1_5_l", x: 650, y: 145, w: 45, h: 60, zone: "elite", desc: "第1排第5列左格" },
	{ id: "s1_5_m", x: 695, y: 145, w: 45, h: 60, zone: "elite", desc: "第1排第5列中格" },
	{ id: "s1_5_r", x: 740, y: 145, w: 46, h: 60, zone: "elite", desc: "第1排第5列右格" },
	{ id: "s1_6_l", x: 794, y: 145, w: 45, h: 60, zone: "normal", desc: "第1排第6列左格" },
	{ id: "s1_6_m", x: 839, y: 145, w: 45, h: 60, zone: "normal", desc: "第1排第6列中格" },
	{ id: "s1_6_r", x: 884, y: 145, w: 46, h: 60, zone: "normal", desc: "第1排第6列右格" },
	{ id: "s2_1_l", x: 30, y: 215, w: 45, h: 60, zone: "normal", desc: "第2排第1列左格" },
	{ id: "s2_1_m", x: 75, y: 215, w: 45, h: 60, zone: "normal", desc: "第2排第1列中格" },
	{ id: "s2_1_r", x: 120, y: 215, w: 46, h: 60, zone: "normal", desc: "第2排第1列右格" },
	{ id: "s2_2_l", x: 174, y: 215, w: 45, h: 60, zone: "elite", desc: "第2排第2列左格" },
	{ id: "s2_2_m", x: 219, y: 215, w: 45, h: 60, zone: "elite", desc: "第2排第2列中格" },
	{ id: "s2_2_r", x: 264, y: 215, w: 46, h: 60, zone: "elite", desc: "第2排第2列右格" },
	{ id: "s2_3_l", x: 340, y: 215, w: 45, h: 60, zone: "elite", desc: "第2排第3列左格" },
	{ id: "s2_3_m", x: 385, y: 215, w: 45, h: 60, zone: "elite", desc: "第2排第3列中格" },
	{ id: "s2_3_r", x: 430, y: 215, w: 46, h: 60, zone: "elite", desc: "第2排第3列右格" },
	{ id: "s2_4_l", x: 484, y: 215, w: 45, h: 60, zone: "elite", desc: "第2排第4列左格" },
	{ id: "s2_4_m", x: 529, y: 215, w: 45, h: 60, zone: "elite", desc: "第2排第4列中格" },
	{ id: "s2_4_r", x: 574, y: 215, w: 46, h: 60, zone: "elite", desc: "第2排第4列右格" },
	{ id: "s2_5_l", x: 650, y: 215, w: 45, h: 60, zone: "elite", desc: "第2排第5列左格" },
	{ id: "s2_5_m", x: 695, y: 215, w: 45, h: 60, zone: "elite", desc: "第2排第5列中格" },
	{ id: "s2_5_r", x: 740, y: 215, w: 46, h: 60, zone: "elite", desc: "第2排第5列右格" },
	{ id: "s2_6_l", x: 794, y: 215, w: 45, h: 60, zone: "normal", desc: "第2排第6列左格" },
	{ id: "s2_6_m", x: 839, y: 215, w: 45, h: 60, zone: "normal", desc: "第2排第6列中格" },
	{ id: "s2_6_r", x: 884, y: 215, w: 46, h: 60, zone: "normal", desc: "第2排第6列右格" },
	{ id: "s3_1_l", x: 30, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第1列左格" },
	{ id: "s3_1_m", x: 75, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第1列中格" },
	{ id: "s3_1_r", x: 120, y: 285, w: 46, h: 60, zone: "normal", desc: "第3排第1列右格" },
	{ id: "s3_2_l", x: 174, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第2列左格" },
	{ id: "s3_2_m", x: 219, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第2列中格" },
	{ id: "s3_2_r", x: 264, y: 285, w: 46, h: 60, zone: "normal", desc: "第3排第2列右格" },
	{ id: "s3_3_l", x: 340, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第3列左格" },
	{ id: "s3_3_m", x: 385, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第3列中格" },
	{ id: "s3_3_r", x: 430, y: 285, w: 46, h: 60, zone: "normal", desc: "第3排第3列右格" },
	{ id: "s3_4_l", x: 484, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第4列左格" },
	{ id: "s3_4_m", x: 529, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第4列中格" },
	{ id: "s3_4_r", x: 574, y: 285, w: 46, h: 60, zone: "normal", desc: "第3排第4列右格" },
	{ id: "s3_5_l", x: 650, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第5列左格" },
	{ id: "s3_5_m", x: 695, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第5列中格" },
	{ id: "s3_5_r", x: 740, y: 285, w: 46, h: 60, zone: "normal", desc: "第3排第5列右格" },
	{ id: "s3_6_l", x: 794, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第6列左格" },
	{ id: "s3_6_m", x: 839, y: 285, w: 45, h: 60, zone: "normal", desc: "第3排第6列中格" },
	{ id: "s3_6_r", x: 884, y: 285, w: 46, h: 60, zone: "normal", desc: "第3排第6列右格" },
	{ id: "s4_1_l", x: 30, y: 355, w: 45, h: 60, zone: "chill", desc: "第4排第1列左格" },
	{ id: "s4_1_m", x: 75, y: 355, w: 45, h: 60, zone: "chill", desc: "第4排第1列中格" },
	{ id: "s4_1_r", x: 120, y: 355, w: 46, h: 60, zone: "chill", desc: "第4排第1列右格" },
	{ id: "s4_2_l", x: 174, y: 355, w: 45, h: 60, zone: "chill", desc: "第4排第2列左格" },
	{ id: "s4_2_m", x: 219, y: 355, w: 45, h: 60, zone: "chill", desc: "第4排第2列中格" },
	{ id: "s4_2_r", x: 264, y: 355, w: 46, h: 60, zone: "chill", desc: "第4排第2列右格" },
	{ id: "s4_3_l", x: 340, y: 355, w: 45, h: 60, zone: "normal", desc: "第4排第3列左格" },
	{ id: "s4_3_m", x: 385, y: 355, w: 45, h: 60, zone: "normal", desc: "第4排第3列中格" },
	{ id: "s4_3_r", x: 430, y: 355, w: 46, h: 60, zone: "normal", desc: "第4排第3列右格" },
	{ id: "s4_4_l", x: 484, y: 355, w: 45, h: 60, zone: "normal", desc: "第4排第4列左格" },
	{ id: "s4_4_m", x: 529, y: 355, w: 45, h: 60, zone: "normal", desc: "第4排第4列中格" },
	{ id: "s4_4_r", x: 574, y: 355, w: 46, h: 60, zone: "normal", desc: "第4排第4列右格" },
	{ id: "s4_5_l", x: 650, y: 355, w: 45, h: 60, zone: "chill", desc: "第4排第5列左格" },
	{ id: "s4_5_m", x: 695, y: 355, w: 45, h: 60, zone: "chill", desc: "第4排第5列中格" },
	{ id: "s4_5_r", x: 740, y: 355, w: 46, h: 60, zone: "chill", desc: "第4排第5列右格" },
	{ id: "s4_6_l", x: 794, y: 355, w: 45, h: 60, zone: "chill", desc: "第4排第6列左格" },
	{ id: "s4_6_m", x: 839, y: 355, w: 45, h: 60, zone: "chill", desc: "第4排第6列中格" },
	{ id: "s4_6_r", x: 884, y: 355, w: 46, h: 60, zone: "chill", desc: "第4排第6列右格" },
	{ id: "s5_1_l", x: 30, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第1列左格" },
	{ id: "s5_1_m", x: 75, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第1列中格" },
	{ id: "s5_1_r", x: 120, y: 425, w: 46, h: 60, zone: "chill", desc: "第5排第1列右格" },
	{ id: "s5_2_l", x: 174, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第2列左格" },
	{ id: "s5_2_m", x: 219, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第2列中格" },
	{ id: "s5_2_r", x: 264, y: 425, w: 46, h: 60, zone: "chill", desc: "第5排第2列右格" },
	{ id: "s5_3_l", x: 340, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第3列左格" },
	{ id: "s5_3_m", x: 385, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第3列中格" },
	{ id: "s5_3_r", x: 430, y: 425, w: 46, h: 60, zone: "chill", desc: "第5排第3列右格" },
	{ id: "s5_4_l", x: 484, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第4列左格" },
	{ id: "s5_4_m", x: 529, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第4列中格" },
	{ id: "s5_4_r", x: 574, y: 425, w: 46, h: 60, zone: "chill", desc: "第5排第4列右格" },
	{ id: "s5_5_l", x: 650, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第5列左格" },
	{ id: "s5_5_m", x: 695, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第5列中格" },
	{ id: "s5_5_r", x: 740, y: 425, w: 46, h: 60, zone: "chill", desc: "第5排第5列右格" },
	{ id: "s5_6_l", x: 794, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第6列左格" },
	{ id: "s5_6_m", x: 839, y: 425, w: 45, h: 60, zone: "chill", desc: "第5排第6列中格" },
	{ id: "s5_6_r", x: 884, y: 425, w: 46, h: 60, zone: "chill", desc: "第5排第6列右格" },
]

// 手牌槽位：双方面板上的学生卡 / 操作卡牌位（框架阶段仅悬停提示）
const CARD_SLOTS = [
	{ id: "pa_a1", x: 305, y: 583, w: 52, h: 64, side: "playerA", kind: "actionCards", index: 1, desc: "玩家A · 成绩派·操作卡 第1张" },
	{ id: "pa_a2", x: 363, y: 583, w: 52, h: 64, side: "playerA", kind: "actionCards", index: 2, desc: "玩家A · 成绩派·操作卡 第2张" },
	{ id: "pa_a3", x: 421, y: 583, w: 52, h: 64, side: "playerA", kind: "actionCards", index: 3, desc: "玩家A · 成绩派·操作卡 第3张" },
	{ id: "pa_a4", x: 479, y: 583, w: 52, h: 64, side: "playerA", kind: "actionCards", index: 4, desc: "玩家A · 成绩派·操作卡 第4张" },
	{ id: "pa_a5", x: 305, y: 653, w: 52, h: 64, side: "playerA", kind: "actionCards", index: 5, desc: "玩家A · 成绩派·操作卡 第5张" },
	{ id: "pa_a6", x: 363, y: 653, w: 52, h: 64, side: "playerA", kind: "actionCards", index: 6, desc: "玩家A · 成绩派·操作卡 第6张" },
	{ id: "pa_a7", x: 421, y: 653, w: 52, h: 64, side: "playerA", kind: "actionCards", index: 7, desc: "玩家A · 成绩派·操作卡 第7张" },
	{ id: "pa_a8", x: 479, y: 653, w: 52, h: 64, side: "playerA", kind: "actionCards", index: 8, desc: "玩家A · 成绩派·操作卡 第8张" },
	{ id: "pa_s1", x: 35, y: 583, w: 52, h: 64, side: "playerA", kind: "studentCards", index: 1, desc: "玩家A · 成绩派·学生卡 第1张" },
	{ id: "pa_s2", x: 93, y: 583, w: 52, h: 64, side: "playerA", kind: "studentCards", index: 2, desc: "玩家A · 成绩派·学生卡 第2张" },
	{ id: "pa_s3", x: 151, y: 583, w: 52, h: 64, side: "playerA", kind: "studentCards", index: 3, desc: "玩家A · 成绩派·学生卡 第3张" },
	{ id: "pa_s4", x: 209, y: 583, w: 52, h: 64, side: "playerA", kind: "studentCards", index: 4, desc: "玩家A · 成绩派·学生卡 第4张" },
	{ id: "pa_s5", x: 35, y: 653, w: 52, h: 64, side: "playerA", kind: "studentCards", index: 5, desc: "玩家A · 成绩派·学生卡 第5张" },
	{ id: "pa_s6", x: 93, y: 653, w: 52, h: 64, side: "playerA", kind: "studentCards", index: 6, desc: "玩家A · 成绩派·学生卡 第6张" },
	{ id: "pa_s7", x: 151, y: 653, w: 52, h: 64, side: "playerA", kind: "studentCards", index: 7, desc: "玩家A · 成绩派·学生卡 第7张" },
	{ id: "pa_s8", x: 209, y: 653, w: 52, h: 64, side: "playerA", kind: "studentCards", index: 8, desc: "玩家A · 成绩派·学生卡 第8张" },
	{ id: "pb_a1", x: 895, y: 583, w: 52, h: 64, side: "playerB", kind: "actionCards", index: 1, desc: "玩家B · 快乐派·操作卡 第1张" },
	{ id: "pb_a2", x: 953, y: 583, w: 52, h: 64, side: "playerB", kind: "actionCards", index: 2, desc: "玩家B · 快乐派·操作卡 第2张" },
	{ id: "pb_a3", x: 1011, y: 583, w: 52, h: 64, side: "playerB", kind: "actionCards", index: 3, desc: "玩家B · 快乐派·操作卡 第3张" },
	{ id: "pb_a4", x: 1069, y: 583, w: 52, h: 64, side: "playerB", kind: "actionCards", index: 4, desc: "玩家B · 快乐派·操作卡 第4张" },
	{ id: "pb_a5", x: 895, y: 653, w: 52, h: 64, side: "playerB", kind: "actionCards", index: 5, desc: "玩家B · 快乐派·操作卡 第5张" },
	{ id: "pb_a6", x: 953, y: 653, w: 52, h: 64, side: "playerB", kind: "actionCards", index: 6, desc: "玩家B · 快乐派·操作卡 第6张" },
	{ id: "pb_a7", x: 1011, y: 653, w: 52, h: 64, side: "playerB", kind: "actionCards", index: 7, desc: "玩家B · 快乐派·操作卡 第7张" },
	{ id: "pb_a8", x: 1069, y: 653, w: 52, h: 64, side: "playerB", kind: "actionCards", index: 8, desc: "玩家B · 快乐派·操作卡 第8张" },
	{ id: "pb_s1", x: 625, y: 583, w: 52, h: 64, side: "playerB", kind: "studentCards", index: 1, desc: "玩家B · 快乐派·学生卡 第1张" },
	{ id: "pb_s2", x: 683, y: 583, w: 52, h: 64, side: "playerB", kind: "studentCards", index: 2, desc: "玩家B · 快乐派·学生卡 第2张" },
	{ id: "pb_s3", x: 741, y: 583, w: 52, h: 64, side: "playerB", kind: "studentCards", index: 3, desc: "玩家B · 快乐派·学生卡 第3张" },
	{ id: "pb_s4", x: 799, y: 583, w: 52, h: 64, side: "playerB", kind: "studentCards", index: 4, desc: "玩家B · 快乐派·学生卡 第4张" },
	{ id: "pb_s5", x: 625, y: 653, w: 52, h: 64, side: "playerB", kind: "studentCards", index: 5, desc: "玩家B · 快乐派·学生卡 第5张" },
	{ id: "pb_s6", x: 683, y: 653, w: 52, h: 64, side: "playerB", kind: "studentCards", index: 6, desc: "玩家B · 快乐派·学生卡 第6张" },
	{ id: "pb_s7", x: 741, y: 653, w: 52, h: 64, side: "playerB", kind: "studentCards", index: 7, desc: "玩家B · 快乐派·学生卡 第7张" },
	{ id: "pb_s8", x: 799, y: 653, w: 52, h: 64, side: "playerB", kind: "studentCards", index: 8, desc: "玩家B · 快乐派·学生卡 第8张" },
]

// 班级氛围轨道：-4 摆烂 ～ +4 内卷（bar 背景条 / ticks 刻度 / pointer 指针 / labels 两端字）
const TRACK = {
	"bar": {
		"x": 670,
		"y": 48,
		"width": 500,
		"height": 36,
		"desc": "班级氛围轨道背景条（-4 到 +4）"
	},
	"ticks": [
		{
			"value": -4,
			"x": 670,
			"y": 48,
			"width": 30,
			"height": 36,
			"centerX": 685,
			"desc": "刻度 -4（摆烂极端）"
		},
		{
			"value": -3,
			"x": 730,
			"y": 48,
			"width": 30,
			"height": 36,
			"centerX": 745,
			"desc": "刻度 -3"
		},
		{
			"value": -2,
			"x": 790,
			"y": 48,
			"width": 30,
			"height": 36,
			"centerX": 805,
			"desc": "刻度 -2"
		},
		{
			"value": -1,
			"x": 850,
			"y": 48,
			"width": 30,
			"height": 36,
			"centerX": 865,
			"desc": "刻度 -1"
		},
		{
			"value": 0,
			"x": 910,
			"y": 48,
			"width": 30,
			"height": 36,
			"centerX": 925,
			"desc": "刻度 0（中立）"
		},
		{
			"value": 1,
			"x": 970,
			"y": 48,
			"width": 30,
			"height": 36,
			"centerX": 985,
			"desc": "刻度 +1"
		},
		{
			"value": 2,
			"x": 1030,
			"y": 48,
			"width": 30,
			"height": 36,
			"centerX": 1045,
			"desc": "刻度 +2"
		},
		{
			"value": 3,
			"x": 1090,
			"y": 48,
			"width": 30,
			"height": 36,
			"centerX": 1105,
			"desc": "刻度 +3"
		},
		{
			"value": 4,
			"x": 1150,
			"y": 48,
			"width": 30,
			"height": 36,
			"centerX": 1165,
			"desc": "刻度 +4（内卷极端）"
		}
	],
	"pointer": {
		"x": 925,
		"y": 40,
		"desc": "当前指针位置（对应刻度 0，可左右移动）",
		"shape": "triangle",
		"points": "925,40 918,48 932,48"
	},
	"labels": {
		"left": {
			"x": 650,
			"y": 92,
			"desc": "左侧文字 '摆' 的位置"
		},
		"right": {
			"x": 1180,
			"y": 92,
			"desc": "右侧文字 '卷' 的位置"
		}
	}
}
