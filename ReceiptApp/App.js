import { TamaguiProvider, createTamagui, YStack, H1, Button, Text } from "tamagui"
import { config } from "@tamagui/config/v3"
import { useState } from "react"

const tamaguiConfig = createTamagui(config)

export default function App() {
  const [toggle, setToggle] = useState(false)

	return (
		<TamaguiProvider config={tamaguiConfig}>
			<YStack fullscreen alignSelf="center" justifyContent="center" alignItems="center" borderColor="red" borderWidth={2}>
				<H1>Split Check</H1>
				<Button backgroundColor="skyblue" onPress={() => setToggle(!toggle)}>Press Me 😩</Button>
        {toggle && <Text>You pressed me.</Text>}
			</YStack>
		</TamaguiProvider>
	)
}
