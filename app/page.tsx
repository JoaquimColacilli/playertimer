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
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  id: number;
  name: string;
  color: string;
  time: number; // almacena el tiempo en milisegundos
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
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Player 1", color: "bg-rose-500", time: 0 },
    { id: 2, name: "Player 2", color: "bg-blue-500", time: 0 },
    { id: 3, name: "Player 3", color: "bg-emerald-500", time: 0 },
    { id: 4, name: "Player 4", color: "bg-amber-500", time: 0 },
  ]);

  // índice del jugador que está corriendo el tiempo
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Edición de nombre y color
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
  const [editingColor, setEditingColor] = useState<number | null>(null);

  // Hint inicial de edición
  const [showEditHint, setShowEditHint] = useState(true);

  // Por defecto, “asc” = Fastest es el menor tiempo
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modales
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playerToDeleteId, setPlayerToDeleteId] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Timer global
  const [globalTime, setGlobalTime] = useState(0);

  // ----------------------
  //    useEffect principal
  // ----------------------
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === currentPlayer ? { ...p, time: p.time + 10 } : p
          )
        );
        setGlobalTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentPlayer]);

  // Ocultar hint si entro a editar un nombre
  useEffect(() => {
    if (editingPlayer !== null) {
      setShowEditHint(false);
    }
  }, [editingPlayer]);

  // ----------------------
  //    Funciones Aux
  // ----------------------
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}:${String(milliseconds).padStart(3, "0")}`;
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

  // ----------------------
  //   RESET DE TIMERS
  // ----------------------
  const handleResetConfirmation = () => {
    setShowResetConfirm(true);
  };
  const confirmReset = () => {
    resetTimers();
    setShowResetConfirm(false);
  };
  const cancelReset = () => {
    setShowResetConfirm(false);
  };
  const resetTimers = () => {
    setIsRunning(false);
    setPlayers((prev) => prev.map((p) => ({ ...p, time: 0 })));
    setCurrentPlayer(0);
    setGlobalTime(0);
  };

  // ----------------------
  //  Manejo de Nombres
  // ----------------------
  const handleNameChange = (id: number, newName: string) => {
    setPlayers((prev) =>
      prev.map((pl) => (pl.id === id ? { ...pl, name: newName } : pl))
    );
  };
  const handleNameBlur = () => {
    setEditingPlayer(null);
  };

  // ----------------------
  //  Manejo de Colores
  // ----------------------
  const handleColorChange = (playerId: number, newColor: string) => {
    setPlayers((prev) =>
      prev.map((pl) => (pl.id === playerId ? { ...pl, color: newColor } : pl))
    );
    setEditingColor(null);
  };

  // ----------------------
  //  Manejo de Players
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
    const updated = players.filter((pl) => pl.id !== id);
    setPlayers(updated);
    if (currentPlayer >= updated.length) {
      setCurrentPlayer(updated.length - 1);
    }
    setPlayerToDeleteId(null);
    setShowDeleteConfirm(false);
  };

  // ----------------------
  //  Player Performance
  // ----------------------
  // stable sort asc
  const sortedAsc = [...players].sort((a, b) => a.time - b.time);

  // stable sort desc
  const sortedDesc = [...players].sort((a, b) => b.time - a.time);

  // Assign players based on sort order
  let topPlayer, secondPlayer, slowestPlayer;
  if (sortOrder === "asc") {
    slowestPlayer = sortedAsc[sortedAsc.length - 1]; // Más lento (Highest time)
    topPlayer = sortedAsc[0]; // Más rápido (Lowest time)

    // Runner Up: Segundo más lento
    secondPlayer = sortedAsc[sortedAsc.length - 2];
  } else if (sortOrder === "desc") {
    // Fastest is the player with the most time
    topPlayer = sortedDesc[0];
    // Runner Up is the next player with the most time
    secondPlayer = sortedDesc[1];
    // Needs Practice is the player with the least time
    slowestPlayer = sortedDesc[sortedDesc.length - 1];
  }

  // color del actual
  const currentPlayerColor = players[currentPlayer]?.color ?? "bg-gray-700";

  // ----------------------
  //       Render
  // ----------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 relative overflow-visible">
      {/* Fondo de círculos */}
      <div className="absolute inset-0 overflow-hidden">
        {players.map((pl, i) => (
          <div
            key={`bg-${pl.id}`}
            className={cn(
              "absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl opacity-20 transition-all duration-1000",
              pl.color,
              i === currentPlayer ? "scale-125" : "scale-100"
            )}
            style={{
              left: `${(i * 30) % 100}%`,
              top: `${(i * 40) % 100}%`,
              transform: `translate(-50%, -50%) scale(${
                i === currentPlayer ? 1.25 : 1
              })`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Player Timer</h1>
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

        {/* Hint */}
        {showEditHint && (
          <div className="text-center mb-4 text-gray-400 animate-pulse">
            <p>💡 Tip: Click on player names to edit them</p>
          </div>
        )}

        {/* Player Performance */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy size={24} className="text-yellow-400" />
              Player Performance
            </h2>
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                position: sortOrder === "asc" ? "Fastest" : "Fastest (Highest)",
                player: topPlayer,
                icon: <Trophy size={36} className="text-yellow-400" />,
                gradient: "from-yellow-500/20 to-transparent",
              },
              {
                position: "Runner Up",
                player: secondPlayer,
                icon: <Medal size={36} className="text-gray-200" />,
                gradient: "from-gray-500/20 to-transparent",
              },
              {
                position:
                  sortOrder === "asc"
                    ? "Needs Practice"
                    : "Needs Practice (Lowest)",
                player: slowestPlayer,
                icon: <Timer size={36} className="text-red-400" />,
                gradient: "from-red-500/20 to-transparent",
              },
            ].map((item) => (
              <div
                key={item.position}
                className={cn(
                  "relative rounded-xl p-6 backdrop-blur-sm bg-gradient-to-b",
                  item.gradient,
                  "border border-white/10 group hover:border-white/20 transition-all"
                )}
              >
                <div className="absolute top-0 right-0 p-4">{item.icon}</div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">{item.position}</p>
                  <h3 className="text-xl font-bold truncate">
                    {item.player?.name || "—"}
                  </h3>
                  <p className="font-mono text-2xl">
                    {item.player ? formatTime(item.player.time) : "--:--:---"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Lista de jugadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {players.map((pl, i) => (
            <div
              key={pl.id}
              className={cn(
                "relative p-4 sm:p-6 rounded-xl transition-all cursor-pointer backdrop-blur-lg bg-opacity-50",
                "border border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1",
                pl.color,
                i === currentPlayer ? "ring-4 ring-white" : "opacity-80"
              )}
              onClick={() => setCurrentPlayer(i)}
            >
              {/* Nombre editable + botones color y borrar */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 flex items-center gap-2">
                  {editingPlayer === pl.id ? (
                    <input
                      type="text"
                      value={pl.name}
                      onChange={(e) => handleNameChange(pl.id, e.target.value)}
                      onBlur={handleNameBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNameBlur();
                      }}
                      className="bg-transparent text-white text-xl font-bold border-b border-white outline-none flex-1"
                      autoFocus
                    />
                  ) : (
                    <h2
                      className="text-xl font-bold cursor-text flex-1 flex items-center gap-2 group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlayer(pl.id);
                      }}
                    >
                      {pl.name}
                      <Edit2
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </h2>
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingColor(editingColor === pl.id ? null : pl.id);
                    }}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Change Color"
                  >
                    <Palette size={20} />
                  </button>

                  {players.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayerToDeleteId(pl.id);
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

              <div className="text-2xl sm:text-3xl font-mono text-center mt-4">
                {formatTime(pl.time)}
              </div>
            </div>
          ))}

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

      {editingColor !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[100] bg-gray-900/80 backdrop-blur-sm"
          onClick={() => setEditingColor(null)}
        >
          <div
            className="bg-gray-800 rounded-xl p-6 w-[90%] max-w-sm mx-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Choose Color</h3>
              <button
                onClick={() => setEditingColor(null)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-6 p-4">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    if (editingColor !== null) {
                      handleColorChange(editingColor, color);
                    }
                  }}
                  className={cn(
                    "w-12 h-12 rounded-full transition-all hover:scale-110 ring-offset-2 ring-offset-gray-800",
                    color,
                    players.find((p) => p.id === editingColor)?.color === color
                      ? "ring-2 ring-white scale-110"
                      : ""
                  )}
                  aria-label={`Select ${color
                    .replace("bg-", "")
                    .replace("-500", "")} color`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
