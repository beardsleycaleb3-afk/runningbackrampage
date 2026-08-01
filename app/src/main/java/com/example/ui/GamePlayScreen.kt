package com.example.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Screen
import com.example.engine.GameViewModel
import kotlinx.coroutines.delay
import kotlin.random.Random

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GamePlayScreen(viewModel: GameViewModel) {
    val team = viewModel.teamCustomization
    val primaryColor = try { Color(android.graphics.Color.parseColor(team.primaryColorHex)) } catch (e: Exception) { Color(0xFF1B5E20) }
    val secondaryColor = try { Color(android.graphics.Color.parseColor(team.secondaryColorHex)) } catch (e: Exception) { Color(0xFFFFD700) }

    // Game state variables
    var playerLane by remember { mutableStateOf(1) } // 0: Left, 1: Center, 2: Right
    var yardsRun by remember { mutableStateOf(0) }
    var gameScore by remember { mutableStateOf(viewModel.careerState.score) }
    var isGameOver by remember { mutableStateOf(false) }
    var isTouchdown by remember { mutableStateOf(false) }
    var obstacles by remember { mutableStateOf(listOf<Obstacle>()) }
    var tickCounter by remember { mutableStateOf(0) }

    // Game loop ticker
    LaunchedEffect(isGameOver, isTouchdown) {
        if (!isGameOver && !isTouchdown) {
            while (true) {
                delay(40) // ~25 fps game loop
                tickCounter++
                yardsRun += 1

                // Move obstacles down
                obstacles = obstacles.map { it.copy(y = it.y + 0.04f) }.filter { it.y < 1.2f }

                // Spawn obstacles occasionally
                if (tickCounter % 35 == 0) {
                    val lane = Random.nextInt(3)
                    val type = if (Random.nextFloat() > 0.3f) ObstacleType.DEFENDER else ObstacleType.COIN
                    obstacles = obstacles + Obstacle(lane = lane, y = -0.2f, type = type)
                }

                // Check collisions
                for (obs in obstacles) {
                    if (obs.y in 0.75f..0.9f && obs.lane == playerLane) {
                        if (obs.type == ObstacleType.DEFENDER) {
                            isGameOver = true
                        } else if (obs.type == ObstacleType.COIN) {
                            viewModel.addCoins(10)
                            gameScore += 50
                        }
                    }
                }

                // Check for Touchdown (100 yards)
                if (yardsRun >= 100) {
                    isTouchdown = true
                    viewModel.recordYardsGained(100, touchdown = true)
                    break
                }
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Q${viewModel.careerState.currentQuarter} | ${yardsRun}/100 Yds", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { viewModel.navigateTo(Screen.MAIN_MENU) }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    Text(
                        text = "🪙 Score: $gameScore",
                        modifier = Modifier.padding(end = 16.dp),
                        fontWeight = FontWeight.Bold
                    )
                }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .pointerInput(Unit) {
                    detectDragGestures { change, dragAmount ->
                        change.consume()
                        if (dragAmount.x > 30 && playerLane < 2) {
                            playerLane++
                        } else if (dragAmount.x < -30 && playerLane > 0) {
                            playerLane--
                        }
                    }
                }
        ) {
            // 3D Canvas Football Field & Runner
            Canvas(modifier = Modifier.fillMaxSize()) {
                drawFootballField(primaryColor)
                drawObstacles(obstacles)
                drawPlayer(playerLane, primaryColor, secondaryColor, team.logoSymbol)
            }

            // Touch Controls Overlay (Left / Right buttons for mobile viewports)
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.BottomCenter
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(
                        onClick = { if (playerLane > 0) playerLane-- },
                        modifier = Modifier
                            .size(80.dp)
                            .padding(4.dp),
                        shape = CircleShape,
                        colors = ButtonDefaults.buttonColors(containerColor = primaryColor.copy(alpha = 0.8f))
                    ) {
                        Text("←", fontSize = 28.sp, color = Color.White)
                    }

                    Button(
                        onClick = { if (playerLane < 2) playerLane++ },
                        modifier = Modifier
                            .size(80.dp)
                            .padding(4.dp),
                        shape = CircleShape,
                        colors = ButtonDefaults.buttonColors(containerColor = primaryColor.copy(alpha = 0.8f))
                    ) {
                        Text("→", fontSize = 28.sp, color = Color.White)
                    }
                }
            }

            // Game Over / Touchdown Dialog Overlay
            if (isGameOver || isTouchdown) {
                AlertDialog(
                    onDismissRequest = {},
                    title = { Text(if (isTouchdown) "🏈 TOUCHDOWN!" else "💥 TACKLED!") },
                    text = {
                        Text(
                            if (isTouchdown) "Incredible drive! You rushed 100 yards for a Touchdown!"
                            else "You were tackled by the defense at ${yardsRun} yards."
                        )
                    },
                    confirmButton = {
                        Button(
                            onClick = {
                                viewModel.recordYardsGained(yardsRun, touchdown = isTouchdown)
                                yardsRun = 0
                                isGameOver = false
                                isTouchdown = false
                                obstacles = emptyList()
                            },
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = null)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Next Drive")
                        }
                    },
                    dismissButton = {
                        OutlinedButton(
                            onClick = { viewModel.navigateTo(Screen.MAIN_MENU) },
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Main Menu")
                        }
                    }
                )
            }
        }
    }
}

enum class ObstacleType { DEFENDER, COIN }
data class Obstacle(val lane: Int, val y: Float, val type: ObstacleType)

fun DrawScope.drawFootballField(fieldColor: Color) {
    val width = size.width
    val height = size.height

    // Background Turf
    drawRect(color = fieldColor, size = size)

    // Perspective Lane Lines
    val horizonY = height * 0.3f
    val bottomY = height

    val laneWidth = width / 3f

    for (i in 0..3) {
        val startX = i * laneWidth
        val bottomX = i * (width / 3f)
        drawLine(
            color = Color.White.copy(alpha = 0.5f),
            start = Offset(width / 2f + (startX - width / 2f) * 0.2f, horizonY),
            end = Offset(bottomX, bottomY),
            strokeWidth = 4f
        )
    }

    // Yard hash marks moving down
    for (i in 0..5) {
        val y = horizonY + (bottomY - horizonY) * (i / 5f)
        drawLine(
            color = Color.White.copy(alpha = 0.3f),
            start = Offset(0f, y),
            end = Offset(width, y),
            strokeWidth = 2f
        )
    }
}

fun DrawScope.drawObstacles(obstacles: List<Obstacle>) {
    val width = size.width
    val height = size.height
    val horizonY = height * 0.3f
    val bottomY = height

    for (obs in obstacles) {
        val laneCenter = (obs.lane * (width / 3f)) + (width / 6f)
        val currentX = width / 2f + (laneCenter - width / 2f) * (0.2f + 0.8f * obs.y)
        val currentY = horizonY + (bottomY - horizonY) * obs.y
        val scale = 0.2f + 0.8f * obs.y
        val radius = 25f * scale

        if (obs.type == ObstacleType.DEFENDER) {
            drawCircle(color = Color.Red, radius = radius, center = Offset(currentX, currentY))
        } else {
            drawCircle(color = Color.Yellow, radius = radius * 0.7f, center = Offset(currentX, currentY))
        }
    }
}

fun DrawScope.drawPlayer(lane: Int, primaryColor: Color, secondaryColor: Color, logo: String) {
    val width = size.width
    val height = size.height
    val laneCenter = (lane * (width / 3f)) + (width / 6f)
    val playerY = height * 0.82f

    // Player shadow & body
    drawCircle(color = Color.Black.copy(alpha = 0.3f), radius = 35f, center = Offset(laneCenter + 5f, playerY + 10f))
    drawCircle(color = primaryColor, radius = 45f, center = Offset(laneCenter, playerY))
    drawCircle(color = secondaryColor, radius = 30f, center = Offset(laneCenter, playerY))
}
