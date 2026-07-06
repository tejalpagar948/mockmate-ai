"use client";

import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import plansData from "@/app/data/prizing-plans.json";
import { useUser } from "@clerk/nextjs";

type BillingCycle = "monthly" | "yearly";

interface PlanFeature {
  label: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  featured: boolean;
  cta: string;
  paymentLink: {
    monthly: string | null;
    yearly: string | null;
  };
  features: PlanFeature[];
}

const { plans } = plansData as { billingOptions: BillingCycle[]; plans: Plan[] };

export default function UpgradePage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const { user } = useUser()

  const handleUpgrade = (plan: Plan) => {
    const link = plan.paymentLink[billing];
    if (!link) return; // Free plan or no link available
    window.location.href = `${link}?prefilled_email=${user?.primaryEmailAddress?.emailAddress}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0612] text-white">
      {/* background glows */}
      <div className="pointer-events-none absolute -left-24 -top-36 h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-36 top-64 h-[450px] w-[450px] rounded-full bg-purple-500/30 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-100px] left-1/3 h-[400px] w-[400px] rounded-full bg-violet-700/30 blur-[120px]" />

      {/* Hero */}
      <section className="relative z-10 px-5 pb-4 pt-20 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
          <Sparkles size={14} />
          Simple pricing, no surprises
        </div>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          Level up your{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
            interview prep.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] text-gray-400">
          Unlock unlimited mock interviews, deeper AI feedback, and real-time
          coaching — before it counts.
        </p>
      </section>

      {/* Billing toggle */}
      <div className="relative z-10 my-10 flex justify-center">
        <div className="flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors ${billing === "monthly"
              ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white"
              : "text-gray-400 hover:text-gray-200"
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors ${billing === "yearly"
              ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white"
              : "text-gray-400 hover:text-gray-200"
              }`}
          >
            Yearly
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[11px] font-bold text-purple-200">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-20 sm:px-10 md:grid-cols-3">
        {plans.map((plan) => {
          const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const link = plan.paymentLink[billing];
          const isDisabled = !link;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-[20px] border p-8 ${plan.featured
                ? "scale-100 border-purple-500 bg-gradient-to-b from-violet-500/10 to-white/[0.03] md:scale-105"
                : "border-white/10 bg-white/[0.03]"
                }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-4 py-1.5 text-xs font-bold">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  Most popular
                </div>
              )}

              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-1.5 min-h-[36px] text-[13.5px] text-gray-400">
                {plan.description}
              </p>

              <div className="mb-6 mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold">₹{price}</span>
                <span className="text-sm text-gray-500">/ month</span>
              </div>

              <button
                onClick={() => handleUpgrade(plan)}
                disabled={isDisabled}
                className={`mb-7 w-full rounded-xl py-3 text-[14.5px] font-bold transition-transform active:scale-[0.98] ${plan.featured
                  ? "bg-gradient-to-r from-violet-600 to-purple-500"
                  : "border border-white/15 bg-transparent hover:bg-white/5"
                  } ${isDisabled ? "cursor-not-allowed opacity-60" : ""}`}
              >
                {plan.cta}
              </button>

              <ul className="flex flex-col gap-3.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className={`flex items-start gap-2.5 text-sm ${feature.included ? "text-gray-200" : "text-gray-600"
                      }`}
                  >
                    <span
                      className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full ${feature.included
                        ? "bg-purple-500/15 text-purple-300"
                        : "bg-white/5 text-gray-600"
                        }`}
                    >
                      {feature.included ? <Check size={11} /> : <X size={11} />}
                    </span>
                    {feature.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <p className="relative z-10 pb-16 text-center text-[13px] text-gray-600">
        Cancel anytime. Prices in INR, billed {billing}.
      </p>
    </div>
  );
}