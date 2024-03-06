<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { CaptionToneEnum } from '$validations/captionFormZodSchema';

	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	export let value: string | undefined;
	export let errorMessage: string[] | undefined;

	const captionToneOptions = Object.values(CaptionToneEnum);

	$: if (errorMessage) toast.error(errorMessage.join(' '));
</script>

<fieldset class="grid w-full gap-2">
	<Label for="toneSelector" class="text-xs sm:text-sm">
		Tone
		<span class="text-muted-foreground">(optional)</span>
	</Label>

	<Select.Root
		portal={null}
		onSelectedChange={(selected) =>
			(value = typeof selected?.value === 'string' ? selected.value : undefined)}
	>
		<Select.Trigger class="w-full" id="toneSelector">
			<Select.Value placeholder="Select caption tone" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each captionToneOptions as toneOption}
					<Select.Item value={toneOption}>
						{toneOption.charAt(0).toUpperCase() + toneOption.slice(1)}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="captionTone" />
	</Select.Root>
</fieldset>
