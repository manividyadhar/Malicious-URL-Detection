declare module 'framer-motion' {
    import * as React from 'react';

    export interface MotionProps {
        initial?: any;
        animate?: any;
        exit?: any;
        transition?: any;
        whileHover?: any;
        whileTap?: any;
        whileInView?: any;
        viewport?: any;
        variants?: any;
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
        onClick?: () => void;
        onHoverStart?: () => void;
        onHoverEnd?: () => void;
        drag?: boolean | 'x' | 'y';
        dragConstraints?: any;
        dragElastic?: number;
        dragMomentum?: boolean;
        layout?: boolean | 'position' | 'size';
        layoutId?: string;
    }

    export const motion: {
        div: React.FC<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
        button: React.FC<MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>;
        section: React.FC<MotionProps & React.HTMLAttributes<HTMLElement>>;
        h1: React.FC<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>;
        h2: React.FC<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>;
        h3: React.FC<MotionProps & React.HTMLAttributes<HTMLHeadingElement>>;
        p: React.FC<MotionProps & React.HTMLAttributes<HTMLParagraphElement>>;
        span: React.FC<MotionProps & React.HTMLAttributes<HTMLSpanElement>>;
        a: React.FC<MotionProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>;
        img: React.FC<MotionProps & React.ImgHTMLAttributes<HTMLImageElement>>;
        nav: React.FC<MotionProps & React.HTMLAttributes<HTMLElement>>;
        ul: React.FC<MotionProps & React.HTMLAttributes<HTMLUListElement>>;
        li: React.FC<MotionProps & React.LiHTMLAttributes<HTMLLIElement>>;
        form: React.FC<MotionProps & React.FormHTMLAttributes<HTMLFormElement>>;
        input: React.FC<MotionProps & React.InputHTMLAttributes<HTMLInputElement>>;
    };

    export const AnimatePresence: React.FC<{
        children?: React.ReactNode;
        mode?: 'wait' | 'sync' | 'popLayout';
    }>;

    export function useAnimation(): any;
    export function useInView(ref: any, options?: any): boolean;
}
