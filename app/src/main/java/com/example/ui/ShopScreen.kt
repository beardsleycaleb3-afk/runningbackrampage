package com.example.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Screen
import com.example.engine.GameViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShopScreen(viewModel: GameViewModel) {
    val state = viewModel.careerState

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Upgrades Shop", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { viewModel.navigateTo(Screen.MAIN_MENU) }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    Row(modifier = Modifier.padding(end = 16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "🪙 ${state.coins}", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Upgrade your Halfback abilities for upcoming quarters and championship drives!",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            UpgradeCard(
                title = "⚡ Speed & Acceleration",
                level = state.speedLevel,
                cost = state.speedLevel * 50,
                description = "Increases running speed and dodge responsiveness.",
                onUpgrade = { viewModel.upgradeStat("speed") }
            )

            UpgradeCard(
                title = "🛡️ Stiff Arm Power",
                level = state.stiffArmLevel,
                cost = state.stiffArmLevel * 50,
                description = "Knocks down defenders and linebackers on contact.",
                onUpgrade = { viewModel.upgradeStat("stiffArm") }
            )

            UpgradeCard(
                title = "🎯 Agility & Footwork",
                level = state.agilityLevel,
                cost = state.agilityLevel * 50,
                description = "Allows quicker lane changing and sharper cuts.",
                onUpgrade = { viewModel.upgradeStat("agility") }
            )

            UpgradeCard(
                title = "🔋 Stamina & Energy",
                level = state.staminaLevel,
                cost = state.staminaLevel * 50,
                description = "Extends turbo burst duration during 100-yard runs.",
                onUpgrade = { viewModel.upgradeStat("stamina") }
            )
        }
    }
}

@Composable
fun UpgradeCard(title: String, level: Int, cost: Int, description: String, onUpgrade: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Badge(containerColor = MaterialTheme.colorScheme.primaryContainer) {
                    Text(text = "Lv. $level", modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
            }
            Text(text = description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Cost: 🪙 $cost", fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary)
                Button(
                    onClick = onUpgrade,
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.ShoppingCart, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Upgrade")
                }
            }
        }
    }
}
