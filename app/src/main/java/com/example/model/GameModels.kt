package com.example.model

data class TeamCustomization(
    val teamName: String = "Gridiron Blitz",
    val primaryColorHex: String = "#1B5E20", // Gridiron Green
    val secondaryColorHex: String = "#FFD700", // Gold
    val logoSymbol: String = "🛡️", // Shield, ⚡, ⭐, 💀, 🐯, 🐻
    val helmetStyle: String = "Classic"
)

data class CareerState(
    val currentQuarter: Int = 1, // 1 to 4
    val yardsGainedThisDrive: Int = 0,
    val targetYards: Int = 100,
    val currentDown: Int = 1,
    val score: Int = 0,
    val coins: Int = 150,
    val speedLevel: Int = 1,
    val stiffArmLevel: Int = 1,
    val agilityLevel: Int = 1,
    val staminaLevel: Int = 1,
    val totalTouchdowns: Int = 0,
    val totalRushingYards: Int = 0
)

enum class Screen {
    MAIN_MENU,
    TEAM_MANAGEMENT,
    CAREER_HUB,
    GAMEPLAY,
    SHOP,
    STATS
}
