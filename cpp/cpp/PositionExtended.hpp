#pragma once

#include <string>
#include <cstdint>

namespace GameSolver {
	namespace Connect4 {
		class PositionExtended final : public Position  {
		public:
			using super = Position;

			PositionExtended() {
				super();
			}

			size_t play(const std::string &seq) {
				for(size_t i = 0, l = seq.size(); i < l; i++) {
					int col = seq[i] - '1';
					if(col < 0 || col >= Position::WIDTH || !canPlay(col) || (isWinningMove(col) && (bWasWinMove = true))) return i;
					playCol(col);
				}
				return seq.size();
			}

			bool bWasWinMove = false;
		};
	}
}

