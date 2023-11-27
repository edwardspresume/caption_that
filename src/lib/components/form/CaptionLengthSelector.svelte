<script lang="ts">
	import Label from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select';

	const captionLengthOptions = [
		{ value: 'short', label: 'Short' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'long', label: 'Long' },
		{ value: 'very-long', label: 'Very Long' }
	];
</script>

<Label class="grid gap-2">
	<span>Caption length</span>

	<Select.Root portal={null}>
		<Select.Trigger class="w-full">
			<Select.Value placeholder="Select caption length" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Caption Length</Select.Label>
				{#each captionLengthOptions as lengthOption}
					<Select.Item value={lengthOption.value} label={lengthOption.label}>
						{lengthOption.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="captionLength" />
	</Select.Root>
</Label>
