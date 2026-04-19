import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DealCard from './DealCard';

export default function KanbanBoard({ board, onDealClick, onAddDeal, onDragEnd }) {
  if (!board) return <div className="p-8 text-gray-400">Loading...</div>;
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-6 overflow-x-auto h-full">
        {board.stages?.map(stage => (
          <div key={stage.id} className="flex-shrink-0 w-72">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                <span className="font-medium text-gray-700 text-sm">{stage.name}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{stage.deals?.length || 0}</span>
              </div>
            </div>
            <Droppable droppableId={stage.id}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps}
                  className={"min-h-24 rounded-xl p-2 transition-colors " + (snapshot.isDraggingOver ? "bg-orange-50" : "bg-gray-50")}>
                  {stage.deals?.map((deal, idx) => (
                    <Draggable key={deal.id} draggableId={deal.id} index={idx}>
                      {(prov) => (
                        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="mb-2">
                          <DealCard deal={deal} onClick={() => onDealClick(deal)} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button onClick={() => onAddDeal(stage)}
                    className="w-full text-sm text-orange-500 hover:text-orange-700 py-2 text-center rounded-lg hover:bg-orange-50 transition-colors">
                    + Add Deal
                  </button>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
