<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { CaptionToneEnum } from '$validations/captionFormZodSchema';

	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	export let value: string;
	export let errorMessage: string[] | undefined;

	const captionToneOptions = Object.values(CaptionToneEnum);

	$: selectedTone = {
		value: value,
		label: value
	};

	$: if (errorMessage) toast.error(errorMessage.join(' '));
</script>

<fieldset class="grid w-full gap-2">
	<Label for="toneSelector" class="text-xs sm:text-sm">Tone</Label>

	<Select.Root
		portal={null}
		selected={selectedTone}
		onSelectedChange={(selected) => {
			selected && (value = selected.value);
		}}
	>
		<Select.Trigger class="w-full" id="toneSelector">
			<Select.Value placeholder="Select caption tone" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each captionToneOptions as toneOption}
					<Select.Item value={toneOption}>
						{toneOption}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="captionTone" />
	</Select.Root>
</fieldset>
