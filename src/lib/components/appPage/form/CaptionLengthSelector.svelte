<script lang="ts">
	import { CaptionLengthEnum } from '$validations/captionFormZodSchema';

	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	export let value: string;
	export let errorMessage: string[] | undefined;

	const captionLengthOptions = Object.values(CaptionLengthEnum);

	$: selectedLength = {
		value: value,
		label: value
	};
</script>

<fieldset class="grid w-full gap-2">
	<Label for="lengthSelector" class="text-xs sm:text-sm">Length</Label>

	<Select.Root
		portal={null}
		selected={selectedLength}
		onSelectedChange={(selected) => {
			selected && (value = selected.value);
		}}
	>
		<Select.Trigger class="w-full" id="lengthSelector">
			<Select.Value placeholder="Select caption length" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each captionLengthOptions as lengthOption}
					<Select.Item value={lengthOption}>
						{lengthOption}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="captionLength" />
	</Select.Root>

	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{/if}
</fieldset>
