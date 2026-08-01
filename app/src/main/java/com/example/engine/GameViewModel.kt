package com.example.engine

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.example.model.CareerState
import com.example.model.Screen
import com.example.model.TeamCustomization

class GameViewModel : ViewModel() {
    var currentScreen by mutableStateOf(Screen.MAIN_MENU)
        private set

    var teamCustomization by mutableStateOf(TeamCustomization())
        private set

    var careerState by mutableStateOf(CareerState())
        private set

    fun navigateTo(screen: Screen) {
        currentScreen = screen
    }

    fun updateTeamCustomization(customization: TeamCustomization) {
        teamCustomization = customization
    }

    fun updateTeamName(name: String) {
        teamCustomization = teamCustomization.copy(teamName = name)
    }

    fun updateColors(primary: String, secondary: String) {
        teamCustomization = teamCustomization.copy(primaryColorHex = primary, secondaryColorHex = secondary)
    }

    fun updateLogo(logo: String) {
        teamCustomization = teamCustomization.copy(logoSymbol = logo)
    }

    fun addCoins(amount: Int) {
        careerState = careerState.copy(coins = careerState.coins + amount)
    }

    fun spendCoins(amount: Int): Boolean {
        if (careerState.coins >= amount) {
            careerState = careerState.copy(coins = careerState.coins - amount)
            return true
        }
        return false
    }

    fun upgradeStat(statType: String) {
        val cost = when (statType) {
            "speed" -> careerState.speedLevel * 50
            "stiffArm" -> careerState.stiffArmLevel * 50
            "agility" -> careerState.agilityLevel * 50
            "stamina" -> careerState.staminaLevel * 50
            else -> 100
        }
        if (spendCoins(cost)) {
            careerState = when (statType) {
                "speed" -> careerState.copy(speedLevel = careerState.speedLevel + 1)
                "stiffArm" -> careerState.copy(stiffArmLevel = careerState.stiffArmLevel + 1)
                "agility" -> careerState.copy(agilityLevel = careerState.agilityLevel + 1)
                "stamina" -> careerState.copy(staminaLevel = careerState.staminaLevel + 1)
                else -> careerState
            }
        }
    }

    fun recordYardsGained(yards: Int, touchdown: Boolean) {
        val newYards = careerState.yardsGainedThisDrive + yards
        val newTotalYards = careerState.totalRushingYards + yards
        val newTDs = if (touchdown) careerState.totalTouchdowns + 1 else careerState.totalTouchdowns
        val earnedCoins = yards * 2 + if (touchdown) 100 else 20

        if (newYards >= careerState.targetYards || touchdown) {
            // Touchdown! Advance quarter or drive
            val nextQuarter = if (careerState.currentQuarter < 4) careerState.currentQuarter + 1 else 1
            careerState = careerState.copy(
                currentQuarter = nextQuarter,
                yardsGainedThisDrive = 0,
                currentDown = 1,
                score = careerState.score + (if (touchdown) 7 else 3),
                coins = careerState.coins + earnedCoins,
                totalTouchdowns = newTDs,
                totalRushingYards = newTotalYards
            )
        } else {
            careerState = careerState.copy(
                yardsGainedThisDrive = newYards,
                coins = careerState.coins + earnedCoins,
                totalRushingYards = newTotalYards
            )
        }
    }
}
