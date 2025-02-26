// @ts-expect-error
import type { FileExtension, MimeType } from "file-type";
import { encodeURI } from "js-base64";

const API_BASE_URL = process.env.NODE_ENV === "production" ? "https://api.transform.in.net" : "http://localhost:8055";

interface TransformInOptions {
  project_id: string;
  api_key: string;
}

interface PrepareTransformationResponse {
  success: boolean;
  data: {
    message: string;
  } | null;
  error: {
    message: string;
    code: number;
  } | null;
}

interface HealthCheckResponse {
  status: string;
}

interface InfoResponse {
  success: boolean;
  data: Info;
}

interface NSFWResponse {
  success: boolean;
  data: NSFWInfo;
}

interface ErrorResponse {
  success: false;
  data: null;
  error: {
    message: string;
    code: number;
  };
}

enum InfoType {
  Image = "image",
  Video = "video",
  Audio = "audio",
  Model = "model",
  Document = "document",
  Archive = "archive",
  Executable = "executable",
  Font = "font",
  System = "system",
  Text = "text",
  Script = "script",
  Unknown = "unknown",
}

interface Options {
  w?: number;
  h?: number;
  f?: string;
  q?: number;
  bl?: number;
}

interface Info {
  readonly base64: string;
  readonly url: string;
  type?: InfoType;
  ext?: FileExtension | "html" | "svg" | string;
  content_type?: MimeType;
  content_type_header?: string;
  width?: number | null;
  height?: number | null;
  size?: number | null;
}

interface NSFWInfo {
  drawing: number;
  hentai: number;
  neutral: number;
  porn: number;
  sexy: number;
}

class TransformIn {
  private readonly api_key: string;
  private readonly project_id: string;

  constructor(options: TransformInOptions) {
    if (!options.api_key) {
      throw new Error("API key is required");
    }

    this.api_key = options.api_key;

    if (!options.project_id) {
      throw new Error("Project ID is required");
    }

    this.project_id = options.project_id;
  }

  private async fetch(url: string, options: RequestInit): Promise<Response> {
    const headers = {
      "X-API-KEY": this.api_key,
      ...options.headers,
    };
    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
  }

  public async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await this.fetch("/server/health", {
        method: "GET",
      });
      return response.json();
    } catch (e) {
      console.error(e);
      return { status: "error" };
    }
  }

  public async info(url: string): Promise<InfoResponse> {
    if (!url || !url.startsWith("http")) {
      throw new Error("Invalid URL");
    }

    const base64 = encodeURI(url);

    try {
      const response = await this.fetch(`/info/${base64}`, {
        method: "GET",
        headers: {
          "X-API-KEY": this.api_key,
        },
      });
      return response.json();
    } catch (e) {
      console.error(e);
      throw new Error("Failed to get info");
    }
  }

  public async nsfwInfo(url: string): Promise<NSFWResponse> {
    if (!url || !url.startsWith("http")) {
      throw new Error("Invalid URL");
    }

    const base64 = encodeURI(url);

    try {
      const response = await this.fetch(`/info/nsfw/${base64}`, {
        method: "GET",
        headers: {
          "X-API-KEY": this.api_key,
        },
      });
      return response.json();
    } catch (e) {
      console.error(e);
      throw new Error("Failed to get info");
    }
  }

  public async prepareTransformation(url: string, options: Options, _await: boolean = false): Promise<PrepareTransformationResponse> {
    if (!url || !url.startsWith("http")) {
      throw new Error("Invalid URL");
    }

    const base64 = encodeURI(url);

    try {
      const optionsString = Object.entries(options)
        .map(([ key, value ]) => `${key}:${value}`)
        .join(",");

      const requestUrl = new URL(`/transformation/${this.project_id}/${this.api_key}/${base64}${optionsString ? `/${optionsString}` : ""}?prepare=1`, API_BASE_URL);
      if (_await) requestUrl.searchParams.set("await", "1");

      const response = await this.fetch(requestUrl.toString().replace(API_BASE_URL, ""), {
        method: "GET",
      });
      return response.json();
    } catch (e: any) {
      console.error(e);
      throw new Error(e);
    }
  }

  public url(url: string, options: Options): string {
    if (!url || !url.startsWith("http")) {
      throw new Error("Invalid URL");
    }

    const base64 = encodeURI(url);
    const optionsString = Object.entries(options)
      .map(([ key, value ]) => `${key}:${value}`)
      .join(",");

    return `${API_BASE_URL}/transformation/${this.project_id}/${this.api_key}/${base64}${optionsString ? `/${optionsString}` : ""}`;
  }
}

export default TransformIn;
