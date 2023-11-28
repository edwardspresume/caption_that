<script lang="ts">
	import { CaptionToneEnum } from '$validations/captionContextSchema';

	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	const captionToneOptions = Object.values(CaptionToneEnum);
</script>

<fieldset class="grid w-full gap-2">
	<Label for="toneSelector" class="text-xs sm:text-sm">Tone (optional)</Label>

	<Select.Root portal={null}>
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
