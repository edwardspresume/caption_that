<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { CaptionLengthEnum } from '$validations/captionFormZodSchema';

	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	export let value: string | undefined;
	export let errorMessage: string[] | undefined;

	const captionLengthOptions = Object.values(CaptionLengthEnum);

	$: if (errorMessage) toast.error(errorMessage.join(' '));
</script>

<fieldset class="grid w-full gap-2">
	<Label for="lengthSelector" class="text-xs sm:text-sm">
		Length
		<span class="text-muted-foreground">(optional)</span>
	</Label>

	<Select.Root
		portal={null}
		onSelectedChange={(selected) =>
			(value = typeof selected?.value === 'string' ? selected.value : undefined)}
	>
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
