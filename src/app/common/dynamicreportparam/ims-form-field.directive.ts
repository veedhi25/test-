import { Directive, Type, OnChanges, OnInit, Input, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ImsFormInputComponent } from "./components/form-input/ims-form-input.component";
import { ImsFormIMultiSelectComponent } from "./components/multi-select/ims-form-multi-select.component";
import { ColumnConfiguration, ColumnField } from "./dynamicreportparam.component";

const components: { [type: string]: Type<ColumnField> } = {
  input: ImsFormInputComponent,
  multiselect: ImsFormIMultiSelectComponent
}
@Directive({
  selector: "[imsdynamicField]",
})
export class ImsFormFieldDirective implements ColumnField, OnChanges, OnInit {
  @Input()
  config: ColumnConfiguration;

  @Input()
  group: FormGroup;

  component: ComponentRef<ColumnField>;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
    }
  }

  ngOnInit() {
    if (!components[this.config.type]) {
      const supporteTypes = Object.keys(components).join(", ");
      throw new Error(
        `Trying to use an unsupported type (${this.config.type}).
        Supported types: ${supporteTypes}`
      );
    }
    const component = this.resolver.resolveComponentFactory<ColumnField>(
      components[this.config.type]
    );
    this.component = this.container.createComponent(component);
    this.component.instance.config = this.config;
  }
}
