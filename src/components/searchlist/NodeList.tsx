import Accordion, { AccordionItem, AccordionProps } from 'components/searchlist/SearchAccordion';
import { LoomNode } from 'utils/logic/types';

function loomNodeToAccordionItem(loomNode: LoomNode): AccordionItem {
  return {
    loomNode,
    children: loomNode.children.map(loomNodeToAccordionItem),
  };
}

function accordionLoom(root_node: LoomNode, setFocusedNodeId: (id: string) => void): AccordionProps {
  return {
    items: [loomNodeToAccordionItem(root_node)],
    setFocusedNodeId
  };
}

export default function LoomList({ root_node, setFocusedNodeId }:
  { root_node: LoomNode, setFocusedNodeId: (id: string) => void }) {
  return (
    <div>
      <Accordion {...accordionLoom(root_node, setFocusedNodeId)} />
    </div>
  );
}