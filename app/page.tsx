"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Palette,
  Edit2,
  ArrowUp,
  ArrowDown,
  X,
  Trophy,
  Medal,
  Skull,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  id: number;
  name: string;
  color: string;
  time: number;
}

const COLORS = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
];

export default function Home() {
  // ----------------------
  //   ESTADOS PRINCIPALES
  // ----------------------
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Player 1", color: "bg-rose-500", time: 0 },
    { id: 2, name: "Player 2", color: "bg-blue-500", time: 0 },
    { id: 3, name: "Player 3", color: "bg-emerald-500", time: 0 },
    { id: 4, name: "Player 4", color: "bg-amber-500", time: 0 },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Edición de nombre y color
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
  const [editingColor, setEditingColor] = useState<number | null>(null);

  // Hint inicial de edición
  const [showEditHint, setShowEditHint] = useState(true);

  // Orden de clasificación
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modales de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playerToDeleteId, setPlayerToDeleteId] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Timer general de la partida
  const [globalTime, setGlobalTime] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player, idx) =>
            idx === currentPlayer
              ? { ...player, time: player.time + 10 }
              : player
          )
        );
        setGlobalTime((prevGlobal) => prevGlobal + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentPlayer]);

  useEffect(() => {
    if (editingPlayer !== null) {
      setShowEditHint(false);
    }
  }, [editingPlayer]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;
  };

  const nextPlayer = () => {
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  };

  const previousPlayer = () => {
    setCurrentPlayer((prev) => (prev - 1 + players.length) % players.length);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Abre modal de confirmación para reset
  const handleResetConfirmation = () => {
    setShowResetConfirm(true);
  };

  // Confirma el reset
  const confirmReset = () => {
    resetTimers();
    setShowResetConfirm(false);
  };

  // Cancela el reset
  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  // Hace reset de todos los tiempos y del timer global
  const resetTimers = () => {
    setIsRunning(false);
    setPlayers((prev) => prev.map((p) => ({ ...p, time: 0 })));
    setCurrentPlayer(0);
    setGlobalTime(0);
  };

  // ----------------------
  // MANEJO DE NOMBRES
  // ----------------------
  const handleNameChange = (id: number, newName: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id ? { ...player, name: newName } : player
      )
    );
  };

  const handleNameBlur = () => {
    setEditingPlayer(null);
  };

  // ----------------------
  //   MANEJO DE COLORES
  // ----------------------
  const handleColorChange = (playerId: number, newColor: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, color: newColor } : player
      )
    );
    setEditingColor(null);
  };

  // ----------------------
  //   MANEJO DE PLAYERS
  // ----------------------
  const addNewPlayer = () => {
    const newId = Math.max(...players.map((p) => p.id)) + 1;
    const newColor = COLORS[players.length % COLORS.length];
    setPlayers([
      ...players,
      { id: newId, name: `Player ${newId}`, color: newColor, time: 0 },
    ]);
  };

  const deletePlayer = (id: number) => {
    if (players.length <= 2) return;
    const updatedPlayers = players.filter((player) => player.id !== id);
    setPlayers(updatedPlayers);
    if (currentPlayer >= updatedPlayers.length) {
      setCurrentPlayer(updatedPlayers.length - 1);
    }
    setPlayerToDeleteId(null);
    setShowDeleteConfirm(false);
  };

  // ----------------------
  //  ORDENAMIENTO
  // ----------------------
  const sortedPlayers = [...players].sort((a, b) =>
    sortOrder === "asc" ? a.time - b.time : b.time - a.time
  );
  const topPlayer = sortedPlayers[0];
  const secondPlayer = sortedPlayers[1];
  const slowestPlayer = sortedPlayers[sortedPlayers.length - 1];

  const currentPlayerColor =
    players[currentPlayer] && players[currentPlayer].color
      ? players[currentPlayer].color
      : "bg-gray-700";

  // ----------------------
  //       RENDER
  // ----------------------
  return (
    // Quitar overflow-hidden o cambiar a overflow-visible
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 relative overflow-visible">
      {/* Fondo con círculos de colores */}
      <div className="absolute inset-0 overflow-hidden">
        {players.map((player, index) => (
          <div
            key={`bg-${player.id}`}
            className={cn(
              "absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl opacity-20 transition-all duration-1000",
              player.color,
              index === currentPlayer ? "scale-125" : "scale-100"
            )}
            style={{
              left: `${(index * 30) % 100}%`,
              top: `${(index * 40) % 100}%`,
              transform: `translate(-50%, -50%) scale(${
                index === currentPlayer ? 1.25 : 1
              })`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Controles de Play/Stop/Next/Prev/Reset */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Player Timer</h1>

          {/* Timer general de la partida */}
          <div className="text-gray-300 mb-4">
            <span className="text-base">Global Time: </span>
            <span className="font-mono text-xl">{formatTime(globalTime)}</span>
          </div>

          <div className="flex justify-center gap-2 sm:gap-4 mb-8">
            <button
              onClick={previousPlayer}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Previous Player"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={toggleTimer}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              aria-label={isRunning ? "Pause" : "Play"}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={nextPlayer}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Next Player"
            >
              <ChevronRight size={24} />
            </button>
            <button
              onClick={handleResetConfirmation}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Reset Timers"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* Hint para edición de nombres */}
        {showEditHint && (
          <div className="text-center mb-4 text-gray-400 animate-pulse">
            <p>💡 Tip: Click on player names to edit them</p>
          </div>
        )}

        {/* Player Performance */}
        <div className="mb-8">
          {/* Encabezado y botón de orden */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Player Performance</h2>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Toggle Sort Order"
            >
              {sortOrder === "asc" ? (
                <ArrowUp size={24} />
              ) : (
                <ArrowDown size={24} />
              )}
            </button>
          </div>

          {/* Contenedor que toma el color del jugador actual (o fallback) */}
          <div
            className={cn(
              "rounded-xl shadow-lg relative overflow-hidden p-6 flex flex-col gap-4 transition-colors",
              currentPlayerColor,
              "bg-opacity-50"
            )}
          >
            <div className="flex items-center justify-around gap-8">
              {/* Top Player */}
              <div className="flex flex-col items-center">
                <Trophy size={36} className="text-yellow-400" />
                <p className="text-xl font-semibold mt-2">
                  {topPlayer?.name || "—"}
                </p>
                <p className="font-mono text-lg">
                  {topPlayer ? formatTime(topPlayer.time) : "--:--:--"}
                </p>
              </div>

              {/* Second Player */}
              <div className="flex flex-col items-center">
                <Medal size={36} className="text-gray-200" />
                <p className="text-xl font-semibold mt-2">
                  {secondPlayer?.name || "—"}
                </p>
                <p className="font-mono text-lg">
                  {secondPlayer ? formatTime(secondPlayer.time) : "--:--:--"}
                </p>
              </div>

              {/* Slowest Player */}
              <div className="flex flex-col items-center">
                <Skull size={36} className="text-red-500" />
                <p className="text-xl font-semibold mt-2">
                  {slowestPlayer?.name || "—"}
                </p>
                <p className="font-mono text-lg">
                  {slowestPlayer ? formatTime(slowestPlayer.time) : "--:--:--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de jugadores + botón para agregar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {players.map((player, index) => (
            <div
              key={player.id}
              // Se quita hover:scale-105 para evitar stacking context
              className={cn(
                "relative p-4 sm:p-6 rounded-xl transition-all cursor-pointer backdrop-blur-lg bg-opacity-50 overflow-visible",
                player.color,
                index === currentPlayer ? "ring-4 ring-white" : "opacity-80"
              )}
              onClick={() => setCurrentPlayer(index)}
            >
              {/* Encabezado: Nombre (editable) + Botones (cambiar color y borrar) */}
              <div className="flex justify-between items-start mb-2">
                {/* Edición de nombre */}
                <div className="flex-1 flex items-center gap-2">
                  {editingPlayer === player.id ? (
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        handleNameChange(player.id, e.target.value)
                      }
                      onBlur={handleNameBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleNameBlur();
                        }
                      }}
                      className="bg-transparent text-white text-xl font-bold border-b border-white outline-none flex-1"
                      autoFocus
                    />
                  ) : (
                    <h2
                      className="text-xl font-bold cursor-text flex-1 flex items-center gap-2 group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlayer(player.id);
                      }}
                    >
                      {player.name}
                      <Edit2
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </h2>
                  )}
                </div>

                {/* Botones de color y borrado */}
                <div className="flex gap-2 items-center">
                  {/* Cambiar color */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingColor(
                          editingColor === player.id ? null : player.id
                        );
                      }}
                      className="color-button p-1 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Change Color"
                      style={{ zIndex: 50 }}
                    >
                      <Palette size={20} />
                    </button>
                    {editingColor === player.id && (
                      // Ajustamos el ancho a min-w para que sea responsivo
                      <div
                        className="color-picker absolute top-full left-0 mt-2 bg-gray-800 p-2 rounded-lg shadow-xl grid grid-cols-4 gap-2 z-50 border border-gray-700 min-w-[10rem] w-full sm:w-auto"
                        style={{ zIndex: 9999 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorChange(player.id, color);
                            }}
                            className={cn(
                              "w-6 h-6 rounded-full transition-transform hover:scale-110",
                              color,
                              player.color === color && "ring-2 ring-white"
                            )}
                            aria-label={`Select ${color
                              .replace("bg-", "")
                              .replace("-500", "")} color`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Borrar jugador (si hay más de 2) */}
                  {players.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayerToDeleteId(player.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-1 rounded-full bg-white text-black hover:bg-gray-300 transition-colors"
                      aria-label="Delete Player"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Tiempo del jugador */}
              <div className="text-2xl sm:text-3xl font-mono text-center">
                {formatTime(player.time)}
              </div>
            </div>
          ))}

          {/* Botón para agregar un nuevo jugador */}
          <button
            onClick={addNewPlayer}
            className="p-4 sm:p-6 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer h-[100px] sm:h-[120px]"
          >
            <Plus size={24} className="mr-2" />
            Add Player
          </button>
        </div>
      </div>

      {/* MODALES */}

      {/* Modal de confirmación para borrar jugador */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl relative">
            <h3 className="text-xl font-bold mb-4 text-center text-white">
              Delete Player
            </h3>
            <p className="text-gray-200 mb-6 text-center">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {players.find((p) => p.id === playerToDeleteId)?.name ||
                  "this player"}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  if (playerToDeleteId !== null) {
                    deletePlayer(playerToDeleteId);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-2 right-2 text-white hover:text-red-400"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación para resetear los timers */}
      {showResetConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl relative">
            <h3 className="text-xl font-bold mb-4 text-center text-white">
              Reset Timers
            </h3>
            <p className="text-gray-200 mb-6 text-center">
              Are you sure you want to reset all player timers?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmReset}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reset
              </button>
              <button
                onClick={cancelReset}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={() => setShowResetConfirm(false)}
              className="absolute top-2 right-2 text-white hover:text-red-400"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
