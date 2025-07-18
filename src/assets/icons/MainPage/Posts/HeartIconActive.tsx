import Svg, { Path } from 'react-native-svg'
import { themeStore } from '@stores/theme'

export const HeartIconActive = ({ size = 20, color = themeStore.currentTheme.originalMainGradientColor.color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 23 21" fill="none">
      <Path d="M11.5 21L9.8325 19.4894C3.91 14.145 0 10.6087 0 6.29428C0 2.75804 2.783 0 6.325 0C8.326 0 10.2465 0.926975 11.5 2.38038C12.7535 0.926975 14.674 0 16.675 0C20.217 0 23 2.75804 23 6.29428C23 10.6087 19.09 14.145 13.1675 19.4894L11.5 21Z" fill={color} />
    </Svg>
  )
}
