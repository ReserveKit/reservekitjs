import { resolve } from 'path'
import { defineConfig, loadEnv, LibraryFormats } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const CJSBuild = env.BUILD_TARGET?.toLocaleLowerCase()?.match('cjs')
	const formats: LibraryFormats[] = CJSBuild ? ['cjs'] : ['es']

	return {
		build: {
			outDir: CJSBuild ? 'dist/cjs' : 'dist/es',
			sourcemap: true,
			copyPublicDir: false,
			lib: {
				entry: resolve(__dirname, 'src'),
				fileName: `[name]`,
				name: 'packagekit',
				formats,
			},
			rollupOptions: {
				external: [
					// ...Object.keys(pkg.dependencies || {})
				],
			},
		},
		plugins: [
			dts({
				outDir: 'dist/types',
			}),
		],
	}
})
