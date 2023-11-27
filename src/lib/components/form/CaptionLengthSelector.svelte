<script lang="ts">
	import { CaptionLengthEnum } from '$lib/types';

	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	const captionLengthOptions = Object.values(CaptionLengthEnum);
</script>

<fieldset class="grid w-full gap-2">
	<Label for="lengthSelector" class="text-xs sm:text-sm">Caption length (optional)</Label>

	<Select.Root portal={null}>
		<Select.Trigger class="w-full" id="lengthSelector">
			<Select.Value placeholder="Select caption length" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each captionLengthOptions as lengthOption}
					<Select.Item value={lengthOption}>
						{lengthOption.charAt(0).toUpperCase() + lengthOption.slice(1).replace('-', ' ')}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="captionLength" />
	</Select.Root>
</fieldset>
