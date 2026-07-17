/**
 * =====================================================
 * Project Phoenix
 * Product : Myntra Analytics
 * Module  : KPI Card
 * Version : V1.2
 * =====================================================
 */

import { createComponent } from "../../utils/createComponent.js";

export async function renderKPICard(target, data) {

    await createComponent({

        target,

        html: "src/components/kpiCard/kpiCard.html",

        css: "src/components/kpiCard/kpiCard.css",

        data

    });

    // Render Lucide Icons
    if (window.lucide) {

        lucide.createIcons();

    }

    // Growth Indicator
    const trend = target.querySelector(".kpi-trend");
    const compare = target.querySelector(".kpi-compare");
    const footer = target.querySelector(".kpi-footer");

    if (data.growth === undefined || data.growth === null) {
        if (footer) {
            footer.style.display = "none";
        } else {
            if (trend) trend.style.display = "none";
            if (compare) compare.style.display = "none";
        }
    } else {
        if (footer) {
            footer.style.display = "";
        }
        if (trend) {
            trend.style.display = "";
            const growth = Number(data.growth);
            trend.classList.remove("up","down","flat");
            if (growth > 0) {
                if (data.growthType === "negative") {
                    trend.classList.add("down");
                } else {
                    trend.classList.add("up");
                }
                trend.innerHTML = `▲ ${growth.toFixed(1)}%`;
            } else if (growth < 0) {
                if (data.growthType === "negative") {
                    trend.classList.add("up");
                } else {
                    trend.classList.add("down");
                }
                trend.innerHTML = `▼ ${Math.abs(growth).toFixed(1)}%`;
            } else {
                trend.classList.add("flat");
                trend.innerHTML = `0.0%`;
            }
        }

        if (compare) {
            compare.style.display = "";
            compare.textContent = `vs ${data.compareLabel || "Previous Month"}`;
        }
    }

}