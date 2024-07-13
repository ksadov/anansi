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

export default function ModelSelect({ modelsSettings, activeModelIndex, setActiveModelIndex }: {
  modelsSettings: ModelSettings[],
  activeModelIndex: number,
  setActiveModelIndex: (index: number) => void
}) {
  return (
    <div>
      <Select
        defaultValue={activeModelIndex.toString()}
        onValueChange={(value) => setActiveModelIndex(parseInt(value))}
      >
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
      </Select>
    </div >
  );
}