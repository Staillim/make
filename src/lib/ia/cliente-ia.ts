/**
 * Cliente Unificado de IA
 * Soporta múltiples proveedores: OpenAI y Google Gemini
 * 
 * Uso:
 * ```typescript
 * const cliente = new ClienteIA({ provider: 'gemini', api_key: '...' });
 * const respuesta = await cliente.generarRespuesta(mensajes);
 * const json = await cliente.extraerJSON(prompt);
 * ```
 */

export type ProveedorIA = 'openai' | 'gemini';

export interface ConfiguracionIA {
  provider: ProveedorIA;
  api_key: string;
  modelo?: string;
  temperatura?: number;
  max_tokens?: number;
}

export interface MensajeIA {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface RespuestaIA {
  contenido: string;
  modelo_usado: string;
  tokens_usados?: number;
  provider: ProveedorIA;
}

/**
 * Cliente unificado que abstrae la complejidad de múltiples proveedores
 */
export class ClienteIA {
  private config: Required<ConfiguracionIA>;
  
  constructor(config: ConfiguracionIA) {
    this.config = {
      provider: config.provider,
      api_key: config.api_key,
      modelo: config.modelo || this.getModeloDefault(config.provider),
      temperatura: config.temperatura ?? 0.7,
      max_tokens: config.max_tokens ?? 2000
    };
  }
  
  /**
   * Obtener modelo por defecto según proveedor
   */
  private getModeloDefault(provider: ProveedorIA): string {
    switch (provider) {
      case 'openai':
        return 'gpt-4o-mini'; // Más económico y rápido
      case 'gemini':
        return 'gemini-1.5-flash'; // Más económico y rápido
    }
  }
  
  /**
   * Generar respuesta de texto con el proveedor configurado
   */
  async generarRespuesta(mensajes: MensajeIA[]): Promise<RespuestaIA> {
    switch (this.config.provider) {
      case 'openai':
        return this.generarRespuestaOpenAI(mensajes);
      case 'gemini':
        return this.generarRespuestaGemini(mensajes);
    }
  }
  
  /**
   * Extraer JSON estructurado (útil para análisis)
   */
  async extraerJSON<T = any>(
    system_prompt: string,
    user_prompt: string
  ): Promise<T> {
    switch (this.config.provider) {
      case 'openai':
        return this.extraerJSONOpenAI<T>(system_prompt, user_prompt);
      case 'gemini':
        return this.extraerJSONGemini<T>(system_prompt, user_prompt);
    }
  }
  
  /**
   * Generar respuesta con OpenAI
   */
  private async generarRespuestaOpenAI(mensajes: MensajeIA[]): Promise<RespuestaIA> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.api_key}`
      },
      body: JSON.stringify({
        model: this.config.modelo,
        messages: mensajes,
        temperature: this.config.temperatura,
        max_tokens: this.config.max_tokens
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    
    return {
      contenido: data.choices[0]?.message?.content || '',
      modelo_usado: data.model,
      tokens_usados: data.usage?.total_tokens,
      provider: 'openai'
    };
  }
  
  /**
   * Generar respuesta con Gemini
   */
  private async generarRespuestaGemini(mensajes: MensajeIA[]): Promise<RespuestaIA> {
    // Convertir mensajes al formato de Gemini
    const contenido_completo = this.convertirMensajesAGemini(mensajes);
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.modelo}:generateContent?key=${this.config.api_key}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: contenido_completo
          }]
        }],
        generationConfig: {
          temperature: this.config.temperatura,
          maxOutputTokens: this.config.max_tokens,
          topP: 0.95,
          topK: 40
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    
    // Extraer respuesta
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Estimar tokens (Gemini no los reporta directamente)
    const tokens_estimados = Math.ceil((contenido_completo.length + texto.length) / 4);
    
    return {
      contenido: texto,
      modelo_usado: this.config.modelo,
      tokens_usados: tokens_estimados,
      provider: 'gemini'
    };
  }
  
  /**
   * Extraer JSON con OpenAI (usando response_format)
   */
  private async extraerJSONOpenAI<T>(
    system_prompt: string,
    user_prompt: string
  ): Promise<T> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.api_key}`
      },
      body: JSON.stringify({
        model: this.config.modelo,
        messages: [
          { role: 'system', content: system_prompt },
          { role: 'user', content: user_prompt }
        ],
        temperature: this.config.temperatura || 0.3,
        response_format: { type: 'json_object' }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    const json_texto = data.choices[0]?.message?.content;
    
    if (!json_texto) {
      throw new Error('OpenAI no devolvió respuesta');
    }
    
    return JSON.parse(json_texto);
  }
  
  /**
   * Extraer JSON con Gemini
   */
  private async extraerJSONGemini<T>(
    system_prompt: string,
    user_prompt: string
  ): Promise<T> {
    const prompt_completo = `${system_prompt}\n\n${user_prompt}\n\nIMPORTANTE: Responde SOLO con JSON válido, sin explicaciones adicionales.`;
    
    const respuesta = await this.generarRespuestaGemini([
      { role: 'user', content: prompt_completo }
    ]);
    
    // Limpiar respuesta (Gemini a veces incluye markdown)
    let json_texto = respuesta.contenido.trim();
    
    // Quitar bloques de código markdown si existen
    if (json_texto.startsWith('```json')) {
      json_texto = json_texto.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (json_texto.startsWith('```')) {
      json_texto = json_texto.replace(/```\n?/g, '');
    }
    
    json_texto = json_texto.trim();
    
    try {
      return JSON.parse(json_texto);
    } catch (error) {
      console.error('Error parseando JSON de Gemini:', json_texto);
      throw new Error(`Gemini no devolvió JSON válido: ${error}`);
    }
  }
  
  /**
   * Convertir mensajes de formato estándar a formato de Gemini
   */
  private convertirMensajesAGemini(mensajes: MensajeIA[]): string {
    let texto = '';
    
    for (const mensaje of mensajes) {
      if (mensaje.role === 'system') {
        texto += `INSTRUCCIONES DEL SISTEMA:\n${mensaje.content}\n\n`;
      } else if (mensaje.role === 'user') {
        texto += `Usuario: ${mensaje.content}\n\n`;
      } else if (mensaje.role === 'assistant') {
        texto += `Asistente: ${mensaje.content}\n\n`;
      }
    }
    
    return texto.trim();
  }
  
  /**
   * Obtener configuración actual
   */
  getConfig(): Required<ConfiguracionIA> {
    return { ...this.config };
  }
  
  /**
   * Cambiar temperatura dinámicamente
   */
  setTemperatura(temperatura: number): void {
    this.config.temperatura = temperatura;
  }
  
  /**
   * Cambiar max tokens dinámicamente
   */
  setMaxTokens(max_tokens: number): void {
    this.config.max_tokens = max_tokens;
  }
}

/**
 * Helper para crear cliente desde variables de entorno
 */
export function crearClienteDesdeEnv(): ClienteIA {
  const openai_key = process.env.OPENAI_API_KEY;
  const gemini_key = process.env.GEMINI_API_KEY;
  
  // Priorizar Gemini si está disponible (más económico)
  if (gemini_key) {
    return new ClienteIA({
      provider: 'gemini',
      api_key: gemini_key
    });
  }
  
  if (openai_key) {
    return new ClienteIA({
      provider: 'openai',
      api_key: openai_key
    });
  }
  
  throw new Error('No se encontró API key de OpenAI ni Gemini. Configura OPENAI_API_KEY o GEMINI_API_KEY en .env');
}

/**
 * Helper para obtener proveedor disponible
 */
export function getProveedorDisponible(): ProveedorIA | null {
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return null;
}

export default ClienteIA;
