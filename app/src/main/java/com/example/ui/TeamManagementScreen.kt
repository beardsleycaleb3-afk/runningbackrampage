package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.TeamCustomization
import com.example.engine.GameViewModel

val colorPalette = listOf(
    "#1B5E20" to "Gridiron Green",
    "#0D47A1" to "Midnight Navy",
    "#B71C1C" to "Crimson Red",
    "#F57F17" to "Gold Rush",
    "#00695C" to "Teal Turf",
    "#4A148C" to "Royal Purple",
    "#E65100" to "Sunset Orange",
    "#212121" to "Stealth Black"
)

val logoOptions = listOf("🛡️", "⚡", "⭐", "💀", "🐯", "🐻", "🦅", "🦈")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TeamManagementScreen(viewModel: GameViewModel) {
    var teamName by remember { mutableStateOf(viewModel.teamCustomization.teamName) }
    var selectedPrimary by remember { mutableStateOf(viewModel.teamCustomization.primaryColorHex) }
    var selectedSecondary by remember { mutableStateOf(viewModel.teamCustomization.secondaryColorHex) }
    var selectedLogo by remember { mutableStateOf(viewModel.teamCustomization.logoSymbol) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Team Management", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { viewModel.navigateTo(com.example.model.Screen.MAIN_MENU) }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Live Uniform & Logo Preview Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = try { Color(android.graphics.Color.parseColor(selectedPrimary)) } catch (e: Exception) { MaterialTheme.colorScheme.surfaceVariant }
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
            ) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        // Helmet / Logo badge
                        Box(
                            modifier = Modifier
                                .size(72.dp)
                                .clip(CircleShape)
                                .background(try { Color(android.graphics.Color.parseColor(selectedSecondary)) } catch (e: Exception) { Color.Yellow })
                                .border(3.dp, Color.White, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = selectedLogo,
                                fontSize = 36.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = teamName.ifEmpty { "Gridiron Team" },
                            style = MaterialTheme.typography.titleLarge,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Uniform Colors & Crest Preview",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                    }
                }
            }

            // Team Name Input
            OutlinedTextField(
                value = teamName,
                onValueChange = { teamName = it },
                label = { Text("Team Name") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(12.dp)
            )

            // Primary Uniform Color Picker
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Primary Uniform Color",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    colorPalette.take(4).forEach { (hex, name) ->
                        ColorSwatch(
                            hex = hex,
                            label = name,
                            isSelected = selectedPrimary == hex,
                            onClick = { selectedPrimary = hex }
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    colorPalette.drop(4).forEach { (hex, name) ->
                        ColorSwatch(
                            hex = hex,
                            label = name,
                            isSelected = selectedPrimary == hex,
                            onClick = { selectedPrimary = hex }
                        )
                    }
                }
            }

            // Secondary / Helmet Stripe Color Picker
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Secondary Accent Color",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    colorPalette.take(4).forEach { (hex, _) ->
                        SmallColorSwatch(
                            hex = hex,
                            isSelected = selectedSecondary == hex,
                            onClick = { selectedSecondary = hex }
                        )
                    }
                }
            }

            // Logo Crest Selection
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Team Logo Crest",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    logoOptions.forEach { logo ->
                        LogoOptionItem(
                            logo = logo,
                            isSelected = selectedLogo == logo,
                            onClick = { selectedLogo = logo }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Save Customization Button
            Button(
                onClick = {
                    viewModel.updateTeamCustomization(
                        TeamCustomization(
                            teamName = teamName.ifEmpty { "Gridiron Blitz" },
                            primaryColorHex = selectedPrimary,
                            secondaryColorHex = selectedSecondary,
                            logoSymbol = selectedLogo
                        )
                    )
                    viewModel.navigateTo(com.example.model.Screen.MAIN_MENU)
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(Icons.Default.Check, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "Save Team Configuration", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun ColorSwatch(hex: String, label: String, isSelected: Boolean, onClick: () -> Unit) {
    val color = try { Color(android.graphics.Color.parseColor(hex)) } catch (e: Exception) { Color.Gray }
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { onClick() }
    ) {
        Box(
            modifier = Modifier
                .size(60.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(color)
                .border(
                    width = if (isSelected) 3.dp else 1.dp,
                    color = if (isSelected) MaterialTheme.colorScheme.primary else Color.LightGray,
                    shape = RoundedCornerShape(12.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            if (isSelected) {
                Icon(Icons.Default.Check, contentDescription = null, tint = Color.White)
            }
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(text = label, style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
fun SmallColorSwatch(hex: String, isSelected: Boolean, onClick: () -> Unit) {
    val color = try { Color(android.graphics.Color.parseColor(hex)) } catch (e: Exception) { Color.Gray }
    Box(
        modifier = Modifier
            .size(50.dp)
            .clip(CircleShape)
            .background(color)
            .border(
                width = if (isSelected) 3.dp else 1.dp,
                color = if (isSelected) MaterialTheme.colorScheme.primary else Color.LightGray,
                shape = CircleShape
            )
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        if (isSelected) {
            Icon(Icons.Default.Check, contentDescription = null, tint = Color.White)
        }
    }
}

@Composable
fun LogoOptionItem(logo: String, isSelected: Boolean, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .size(44.dp)
            .clip(CircleShape)
            .background(if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant)
            .border(
                width = if (isSelected) 2.dp else 1.dp,
                color = if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent,
                shape = CircleShape
            )
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Text(text = logo, fontSize = 22.sp)
    }
}
