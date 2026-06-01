import { Tracer } from "./tracer.cjs";
import { TracerOptions } from "./tracer_options.cjs";
//#region src/trace/tracer_provider.d.ts
/**
 * A registry for creating named {@link Tracer}s.
 *
 * @since 1.0.0
 */
interface TracerProvider {
  /**
   * Returns a Tracer, creating one if one with the given name and version is
   * not already created.
   *
   * This function may return different Tracer types (e.g.
   * {@link NoopTracerProvider} vs. a functional tracer).
   *
   * @param name The name of the tracer or instrumentation library.
   * @param version The version of the tracer or instrumentation library.
   * @param options The options of the tracer or instrumentation library.
   * @returns Tracer A Tracer with the given name and version
   */
  getTracer(name: string, version?: string, options?: TracerOptions): Tracer;
}
//#endregion
export { TracerProvider };
//# sourceMappingURL=tracer_provider.d.cts.map