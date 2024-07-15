import { useState } from 'react';
import Accordion, { AccordionItem, AccordionProps } from './SearchAccordion';
import { LoomNode } from 'components/types';

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


export default function LoomList({ root_node, setFocusedNodeId }: { root_node: LoomNode, setFocusedNodeId: (id: string) => void }) {
  const [searchTerm] = useState('');
  return (
    <div>
      <Accordion {...accordionLoom(root_node, setFocusedNodeId)} />
    </div>
  );
}