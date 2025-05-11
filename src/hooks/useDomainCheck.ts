import { useState, useEffect } from "react";

export type DomainStatus = {
  domain: string;
  isBlocked: boolean;
  statusCode?: number | null;
  icpBlocked?: boolean;
  dnsBlocked?: boolean;
  whoisBlocked?: boolean;
  errorMessage?: string;
};

/**
 * **检测域名是否被监管**
 * @param domain 需要检测的域名
 * @returns {DomainStatus} 详细的域名状态
 */
export const useDomainCheck = (domain: string) => {
  const [status, setStatus] = useState<DomainStatus>({
    domain,
    isBlocked: false,
    statusCode: null,
    icpBlocked: false,
    dnsBlocked: false,
    whoisBlocked: false,
    errorMessage: "",
  });

  useEffect(() => {
    const checkDomainStatus = async () => {
      const result: DomainStatus = { ...status };

      try {
        // ✅ 通过 Next.js API 代理访问，避免 CORS 限制
        const response = await fetch(`/api/proxy?domain=${domain}`);

        if (response.status >= 200 && response.status < 400) {
          result.statusCode = response.status;
          result.isBlocked = false;
        } else {
          result.isBlocked = true;
        }
      } catch (error) {
        result.isBlocked = true;
        result.errorMessage = `无法访问 ${domain}: ${error}`;
      }

      try {
        // ✅ 查询 ICP 备案
        const icpResponse = await fetch(`/api/icp-check?domain=${domain}`);
        const icpData = await icpResponse.json();
        result.icpBlocked = icpData?.isBlocked ?? false;
      } catch {}

      try {
        // ✅ 解析 DNS
        const dnsResponse = await fetch(`/api/dns-check?domain=${domain}`);
        const dnsData = await dnsResponse.json();
        result.dnsBlocked = !dnsData?.Answer;
      } catch {}

      try {
        // ✅ 获取 WHOIS 信息
        const whoisResponse = await fetch(`/api/whois-check?domain=${domain}`);
        const whoisData = await whoisResponse.json();
        result.whoisBlocked = whoisData?.isBlocked ?? false;
      } catch {}

      setStatus(result);
    };

    checkDomainStatus();
  }, [domain, status]);

  return status;
};
