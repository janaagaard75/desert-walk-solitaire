import { observer } from "mobx-react-lite";
import { View } from "react-native";
import { EmptyCellView } from "./EmptyCellView";
import { ComputedSettings } from "./model/ComputedSettings";
import { Game } from "./model/Game";
import { PositionedCardView } from "./PositionedCardView";

export const GridView = observer(() => (
  <View
    style={{
      height: ComputedSettings.instance.gridSize.height,
      position: "relative",
      width: ComputedSettings.instance.gridSize.width,
    }}
  >
    {Game.instance.currentGridState.positionedCards.map((positionedCard) => (
      <PositionedCardView
        key={positionedCard.card.key}
        cardSize={ComputedSettings.instance.cardSize}
        positionedCard={positionedCard}
      />
    ))}
    {Game.instance.currentGridState.emptyCells.map((emptyCell) => (
      <EmptyCellView emptyCell={emptyCell} key={emptyCell.cell.key} />
    ))}
  </View>
));
