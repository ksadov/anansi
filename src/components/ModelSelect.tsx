import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "../@/components/ui/select"
import { ModelSettings } from "./types"

export default function ModelSelect({ modelsSettings, activeModelIndex, setActiveModelIndex, isGenerating }: {
  modelsSettings: ModelSettings[],
  activeModelIndex: number,
  setActiveModelIndex: (index: number) => void,
  isGenerating: boolean
}) {
  const innerSelect = <>
    <SelectTrigger className="h-8">
      <SelectValue className="text-small" />
    </SelectTrigger>
    <SelectContent className="overflow-y-auto max-h-[200px]">
      <SelectGroup>
        <SelectLabel>Models</SelectLabel>
        {modelsSettings.map((model, index) => (
          <SelectItem
            value={index.toString()}
            key={index}
          >
            {model.name}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </>

  if (isGenerating) {
    return (
      <div>
        <Select
          disabled
        >
          {innerSelect}
        </Select>
      </div >
    );
  }
  else
    return (
      <div>
        <Select
          defaultValue={activeModelIndex.toString()}
          onValueChange={(value) => setActiveModelIndex(parseInt(value))}
        >
          {innerSelect}
        </Select>
      </div >
    );
}