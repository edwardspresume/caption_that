export enum AlertType {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info'
}

export type AlertMessageType = {
	alertType: 'success' | 'error' | 'warning' | 'info';
	alertText: string;
};

export type EnterKeyHintType =
	| 'search'
	| 'enter'
	| 'done'
	| 'go'
	| 'next'
	| 'previous'
	| 'send'
	| null
	| undefined;

export enum CaptionLengthEnum {
	Short = 'short',
	Medium = 'medium',
	Long = 'long',
	VeryLong = 'very-long'
}

export enum CaptionToneEnum {
	Funny = 'funny',
	Witty = 'witty',
	Serious = 'serious',
	Casual = 'casual',
	Formal = 'formal',
	Inspirational = 'inspirational',
	Enthusiastic = 'enthusiastic',
	Informative = 'informative'
}

// Type for prettifying an object type
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & Record<string, never>;
