<script lang="ts">
	import { CaptionLengthEnum } from '$lib/types';

	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	const captionLengthOptions = Object.values(CaptionLengthEnum);
</script>

<Label class="grid gap-2">
	<span>Caption length (optional)</span>

	<Select.Root portal={null}>
		<Select.Trigger class="w-full">
			<Select.Value placeholder="Select caption length" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group class="capitalize">
				{#each captionLengthOptions as lengthOption}
					<Select.Item value={lengthOption} label={lengthOption}>
						{lengthOption.replace('-', ' ')}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="captionLength" />
	</Select.Root>
</Label>
