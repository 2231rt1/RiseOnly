import { pxNative } from '@lib/theme'
import { themeStore } from '@stores/theme'
import { observer } from 'mobx-react-lite'
import { GestureResponderEvent, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { LoaderUi } from '../LoaderUi/LoaderUi'

interface ButtonUiProps {
	style?: any
	disabled?: boolean
	px?: number
	bRad?: number
	backgroundColor?: string
	height?: number | "auto"
	fitContent?: boolean
	paddingLeft?: number
	paddingRight?: number
	paddingHorizontal?: number
	paddingVertical?: number
	gap?: number
	labelStyle?: any
	children?: React.ReactNode
	isPending?: boolean
	loaderColor?: string
	onPress?: (event: GestureResponderEvent) => void
	// ... другие свойства TouchableOpacity
}

export const ButtonUi = observer(({
	style,
	disabled = false,
	isPending = false,
	px = 15,
	backgroundColor = themeStore.currentTheme.originalMainGradientColor.color,
	height = pxNative(themeStore.currentTheme.btnsTheme.height),
	bRad,
	fitContent = false,
	paddingHorizontal = 0,
	paddingVertical = 0,
	paddingLeft = 0,
	paddingRight = 0,
	children,
	gap = 0,
	labelStyle,
	loaderColor = themeStore.currentTheme.textColor.color as string,
	...props
}: ButtonUiProps) => {
	const { currentTheme } = themeStore

	return (
		<TouchableOpacity
			disabled={disabled}
			style={[
				{
					opacity: disabled ? 0.5 : 1,
					backgroundColor: backgroundColor,
					height: height === 'auto' ? 'auto' : height,
					borderRadius: bRad ? bRad : pxNative(currentTheme.btnsTheme.borderRadius),
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					// Если fitContent = false, то кнопка занимает всю ширину
					alignSelf: fitContent ? 'flex-start' : 'auto',
					width: fitContent ? 'auto' : '100%',
					paddingVertical: paddingVertical,
					paddingLeft: paddingLeft,
					paddingRight: paddingRight,
					paddingHorizontal: paddingHorizontal,
					gap: gap,
				},
				style
			]}
			{...props}
		>
			{isPending ? (
				<LoaderUi color={loaderColor} />
			) : typeof children === 'string' ? (
				<Text
					style={[
						{
							fontSize: px,
							color: currentTheme.textColor.color
						},
						labelStyle
					]}
				>
					{children}
				</Text>
			) : (
				children
			)}
		</TouchableOpacity>
	)
})